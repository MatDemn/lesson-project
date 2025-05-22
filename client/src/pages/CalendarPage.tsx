import { Component, ReactElement, useEffect, useRef } from "react";
import { LessonEvent as LessonEventModel } from "../models/lessonEvent";
import * as CalendarApi from "../network/googleCalendar_api";
import React from "react";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { DiscordUser } from "../models/discordUser";
import LessonEvent from "../components/LessonEvent";
import CalendarPageStyle from "../styles/CalendarPage.module.css";
import "../styles/CalendarPage.module.css";
import { FieldErrors, useForm } from "react-hook-form";
import CalendarEvent, { EventType } from "../components/partials/CalendarEvent";
import { stringToTime } from "../utils/formatTime";
import { DevTool } from "@hookform/devtools";
import { ErrorMessage } from "@hookform/error-message";
import FormError from "../components/partials/FormError";
import { EventInput } from "../network/googleCalendar_api";
import DeleteDialog from "../components/dialogs/DeleteDialog";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import * as ReCaptchaApi from "../network/reCaptcha_api";
import { Bounce, toast } from "react-toastify";
import { makeNotification } from "../utils/toastNotification";
import CalendarCellTitle from "../components/partials/CalendarCellTitle";
import CalendarTable from "../components/calendar/CalendarTable";
import LoggedOutCard from "../components/partials/loggedOutCard";

interface CalendarPageProps {
  loggedUser: DiscordUser | null;
}

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  offsetPercent: string;
  slotSpan: number;
  eventType: EventType;
}

interface CalendarEventInputForm {
  eventDate: string;
  eventBeginTime: string;
  eventDuration: number;
}

const CalendarPage = ({ loggedUser }: CalendarPageProps) => {
  const [eventsLoading, setEventsLoading] = React.useState(false);
  const [allLessonEvents, setAllLessonEvents] = React.useState<
    LessonEventModel[]
  >([]);
  const [busySlots, setBusySlots] = React.useState<Map<string, TimeSlot>>(
    new Map()
  );
  const [choosenWeekIndex, setChoosenWeekIndex] = React.useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [focusedEventId, setFocusedEventId] = React.useState<TimeSlot | null>(
    null
  );

  const recaptcha = useRef<ReCAPTCHA>(null);

  const {
    setError,
    clearErrors,
    getValues,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CalendarEventInputForm>({
    defaultValues: {
      eventDate: undefined,
      eventBeginTime: undefined,
      eventDuration: undefined,
    },
  });

  const startHour = 10;
  const endHour = 22;
  const startMinutes = 0;
  const endMinutes = 0;

  const timeStep = 60; // in minutes
  const timeBufor = 15; // in minutes

  const timeSlots = generateTimeSlots();

  const startDay = new Date();
  const shiftAmount = (startDay.getDay() + 6) % 7;
  startDay.setDate(startDay.getDate() - shiftAmount);
  const endDay = new Date(startDay);
  startDay.setDate(startDay.getDate() + choosenWeekIndex * 7);
  endDay.setDate(endDay.getDate() + choosenWeekIndex * 7 + 6);

  const weekDates = generateWeekDates(startDay, 7);

  function generateTimeSlots() {
    const timeSlots: string[] = [];

    let currentHour = startHour;
    let currentMinute = startMinutes;

    const endTotal = endHour * 100 + endMinutes;
    let currentTotal = startHour * 100 + startMinutes;
    while (currentTotal < endTotal) {
      let elem = `${currentHour}:${
        (currentMinute < 10 ? "0" : "") + currentMinute
      }-`;
      currentMinute += timeStep;
      currentHour += (currentMinute / 60) | 0; // hacky way to convert float to int
      currentMinute %= 60;
      elem += `${currentHour}:${
        (currentMinute < 10 ? "0" : "") + currentMinute
      }`;
      timeSlots.push(elem);

      currentTotal = currentHour * 100 + currentMinute;
    }
    return timeSlots;
  }

  function generateWeekDates(startDate: Date, dayCount: number): Date[] {
    if (dayCount <= 0) return [startDate];

    let result: Date[] = [];
    for (let i = 0; i < dayCount; i++) {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + i);
      result.push(newDate);
    }
    return result;
  }

  function createSlot(
    id: string,
    startDate: Date,
    endDate: Date,
    eventType: EventType
  ) {
    const parentDate = new Date(startDate);

    const startTimeZero = new Date(startDay);
    startTimeZero.setHours(0, 0, 0, 0);
    const eventTimeZero = new Date(startDate);
    eventTimeZero.setHours(0, 0, 0, 0);

    parentDate.setTime(
      Math.floor(
        (parentDate.getTime() - startMinutes * 60 * 1000) /
          (timeStep * 60 * 1000)
      ) *
        timeStep *
        60 *
        1000 +
        startMinutes * 60 * 1000
    );
    let slotDayIndex = Math.round(
      (eventTimeZero.getTime() - startTimeZero.getTime()) / (1000 * 3600 * 24)
    );
    const slotDayStart = new Date(startDate);
    slotDayStart.setHours(startHour);
    slotDayStart.setMinutes(startMinutes);

    const uniqueId =
      slotDayIndex +
      "|" +
      Math.floor(
        (startDate.getTime() - slotDayStart.getTime()) / (1000 * 60) / timeStep
      );
    busySlots.set(uniqueId, {
      id: id,
      startTime: startDate,
      endTime: endDate,
      offsetPercent: getTopPercent(parentDate, startDate) + "%",
      slotSpan: getTimeStepSpan(startDate, endDate),
      eventType: eventType,
    });
  }

  function createBreak(slotEndDate: Date) {
    // const endDate = new Date(slotEndDate.getTime()+timeBufor*1000*60);
    // createSlot(slotEndDate, endDate, EventType.Break);
  }

  function getTopPercent(parentDate: Date, childDate: Date): number {
    const difference = Math.abs(childDate.getTime() - parentDate.getTime());
    return (
      (Math.round((difference / (60 * 1000) / timeStep) * 100) / 100) * 100
    );
  }
  function getTimeStepSpan(beginDate: Date, endDate: Date): number {
    const timeSpan =
      (endDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60);
    return timeSpan + (timeSpan > 1 ? (timeSpan - 1) * 0.017 : 0);
  }

  async function validateNewDate(
    newEventBeginDate: string,
    newEventBeginTime: string,
    newEventDuration: number
  ): Promise<boolean> {
    if (!newEventBeginDate || !newEventBeginTime || !newEventDuration) {
      return false;
    }

    const beginDate = new Date(newEventBeginDate);
    const splitTime = newEventBeginTime.split(":"),
      hour = +splitTime[0],
      minute = +splitTime[1];
    beginDate.setHours(hour);
    beginDate.setMinutes(minute);
    const endDate = new Date(beginDate);
    endDate.setMinutes(beginDate.getMinutes() + newEventDuration * 60);
    const response = await CalendarApi.checkTimeSlot({
      beginDate: beginDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return response.state;
  }

  function onEventDelete(timeslot: TimeSlot) {
    setFocusedEventId(timeslot);
    setShowDeleteDialog(true);
  }

  async function onConfirmDelete() {
    try {
      if (!focusedEventId) {
        return;
      }
      await CalendarApi.deleteEvent(
        focusedEventId.id,
        focusedEventId?.startTime.toISOString()
      );
      setAllLessonEvents(
        allLessonEvents.filter((event) => event.id !== focusedEventId.id)
      );
      setBusySlots(new Map<string, TimeSlot>(busySlots));
    } catch (error) {
      makeNotification("" + error, "Error");
      console.error(error);
    }
  }

  function onEventSaved(newEvent: LessonEventModel) {
    setAllLessonEvents([...allLessonEvents, newEvent]);
    setBusySlots(new Map<string, TimeSlot>(busySlots));
  }

  async function onSubmit(input: CalendarEventInputForm) {
    if (!loggedUser) {
      //setError("root.auth", {message: "Użytkownik nie jest zalogowany."});
      console.log("Użytkownik nie jest zalogowany.");
      makeNotification("Użytkownik nie jest zalogowany.", "Error");
      return;
    }

    const captchaValue = recaptcha.current?.getValue();
    if (!captchaValue) {
      //setError("root.recaptcha", {message: "Weryfikacja reCAPTCHA nie powiodła się."});
      console.log("Weryfikacja reCAPTCHA nie powiodła się.");
      makeNotification("Weryfikacja reCAPTCHA nie powiodła się.", "Error");
      return;
    }

    const response = await ReCaptchaApi.verifyReCAPTCHA(captchaValue);
    if (!response.success) {
      //setError("root.recaptcha", {message: "Weryfikacja reCAPTCHA nie powiodła się."});
      console.log("Weryfikacja reCAPTCHA nie powiodła się.");
      makeNotification("Weryfikacja reCAPTCHA nie powiodła się.", "Error");
      return;
    }

    const splitTime = input.eventBeginTime.split(":"),
      totalEndMins =
        60 * +splitTime[0] + +splitTime[1] + input.eventDuration * 60;
    const endMins = endHour * 60 + endMinutes;

    if (totalEndMins > endMins) {
      //setError("root.busy", { message: "Zajęcia kończą się za późno."});
      console.log("Zajęcia kończą się za późno.");
      makeNotification("Zajęcia kończą się za późno.", "Error");
      return;
    }

    recaptcha.current?.reset();

    const timeSlotValidation = await validateNewDate(
      input.eventDate,
      input.eventBeginTime,
      input.eventDuration
    );
    if (!timeSlotValidation) {
      //setError("root.busy", { message: "Termin nie jest dostępny."});
      console.log("Termin nie jest dostępny.");
      makeNotification("Termin nie jest dostępny.", "Error");
      return;
    }

    try {
      const arr = input.eventBeginTime.split(":");
      const start = new Date(input.eventDate);
      start.setHours(+arr[0]);
      start.setMinutes(+arr[1]);
      const end = new Date(start);
      end.setMinutes(+arr[1] + input.eventDuration * 60);

      const newEvent: EventInput = {
        beginDate: start.toISOString(),
        endDate: end.toISOString(),
        discordId: loggedUser.discordId,
      };
      const response = await CalendarApi.createEvent(newEvent);
      onEventSaved(response);
    } catch (error) {
      console.log(error);
      makeNotification("" + error, "Error");
    }
  }

  function changeWeek(direction: number) {
    setChoosenWeekIndex(choosenWeekIndex + direction);
  }

  useEffect(() => {
    async function loadEvents() {
      try {
        setEventsLoading(true);
        const currentWeekLessonEvents = await CalendarApi.fetchCurrentWeek(
          choosenWeekIndex
        );
        setAllLessonEvents(currentWeekLessonEvents);
        busySlots.clear();
        currentWeekLessonEvents.map((lessonEv) => {
          createSlot(
            lessonEv.id,
            new Date(lessonEv.startDate),
            new Date(lessonEv.endDate),
            lessonEv.discordId === (loggedUser?.discordId || " ")
              ? EventType.Reserved
              : EventType.Busy
          );
          createBreak(new Date(lessonEv.endDate));
        });
      } catch (error) {
        console.error(error);
        makeNotification("" + error, "Error");
      } finally {
        setEventsLoading(false);
      }
    }
    loadEvents();
  }, [loggedUser, choosenWeekIndex, busySlots]);

  return (
    <>
      <div>
        <h1>
          Terminy (
          {startDay.getDate() +
            "." +
            String(startDay.getMonth() + 1).padStart(2, "0")}
          -
          {endDay.getDate() +
            "." +
            String(endDay.getMonth() + 1).padStart(2, "0")}
          ):
        </h1>
        {eventsLoading ? (
          <div className="position-relative">
            <CalendarTable
              weekDates={weekDates}
              timeSlots={timeSlots}
              busySlots={new Map()}
              timeStep={timeStep}
              onEventDelete={(arg0: TimeSlot) => {}}
            />
            <div className="position-absolute bg-trans-grey top-0 end-0 start-0 end-0 z-1 w-100 h-100">
              <Spinner className="position-absolute top-50 end-50 start-50 z-2" />
            </div>
          </div>
        ) : (
          <CalendarTable
            weekDates={weekDates}
            timeSlots={timeSlots}
            busySlots={busySlots}
            timeStep={timeStep}
            onEventDelete={onEventDelete}
          />
        )}
        <div className={CalendarPageStyle.navigation + " pt-1"}>
          {choosenWeekIndex !== 0 && (
            <Button
              onClick={() => changeWeek(-choosenWeekIndex)}
              className={"mx-1"}
            >
              {"Dzisiaj"}
            </Button>
          )}
          {choosenWeekIndex > -5 && (
            <Button onClick={() => changeWeek(-1)}>{"<"}</Button>
          )}
          <span className="p-2">
            {startDay.toLocaleDateString("pl")}-
            {endDay.toLocaleDateString("pl")}
          </span>
          {choosenWeekIndex < 5 && (
            <Button onClick={() => changeWeek(1)}>{">"}</Button>
          )}
        </div>
        <div className={CalendarPageStyle.bottomColumns}>
          <div className={CalendarPageStyle.leftColumn}>
            {!loggedUser && (
              <div className={CalendarPageStyle.formHide}>
                Zaloguj się, aby rezerwować terminy!
                <div>
                  <LoggedOutCard />
                </div>
              </div>
            )}
            <h1>Dodaj nowy termin:</h1>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              className={CalendarPageStyle.newEventForm}
              id="newEventForm"
            >
              <Form.Group className="mb-3">
                <Form.Label>Data</Form.Label>
                <Form.Select
                  isInvalid={!!errors.eventDate}
                  disabled={isSubmitting || !loggedUser}
                  {...register("eventDate", {
                    required: "Wymagane",
                  })}
                >
                  {weekDates.map((date, weekIndex) => (
                    <option key={"form" + weekIndex} value={date.toISOString()}>
                      {date.getDate() +
                        "." +
                        String(date.getMonth() + 1).padStart(2, "0") +
                        " (" +
                        date.toLocaleDateString("pl", { weekday: "long" }) +
                        ")"}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.eventDate?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Godzina rozpoczęcia</Form.Label>
                <Form.Control
                  isInvalid={!!errors.eventBeginTime}
                  disabled={isSubmitting || !loggedUser}
                  type="time"
                  step="60"
                  min={
                    startHour + ":" + startMinutes.toString().padStart(2, "0")
                  }
                  max={endHour + ":" + endMinutes.toString().padStart(2, "0")}
                  placeholder="16:30"
                  {...register("eventBeginTime", {
                    required: "Wymagane",
                    validate: {
                      earlierThanPossible: (v) =>
                        stringToTime(v) >=
                          stringToTime(startHour + ":" + startMinutes) ||
                        `Nie można rezerwować lekcji przed ${startHour}:${startMinutes
                          .toString()
                          .padStart(2, "0")}`,

                      laterThanPossible: (v) =>
                        stringToTime(v) <=
                          stringToTime(endHour + ":" + endMinutes) ||
                        `Nie można rezerwować lekcji po ${endHour}:${endMinutes
                          .toString()
                          .padStart(2, "0")}`,
                    },
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.eventBeginTime?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Czas trwania</Form.Label>
                <Form.Select
                  isInvalid={!!errors.eventDuration}
                  disabled={isSubmitting || !loggedUser}
                  {...register("eventDuration", {
                    required: "Wymagane",
                  })}
                >
                  <option value="1">1 godzina</option>
                  <option value="1.5">1 godzina 30 minut</option>
                  <option value="2">2 godziny</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.eventDuration?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {errors.root && (
                <>
                  <FormError message={errors.root.busy?.message} />
                  <FormError message={errors.root.recaptcha?.message} />
                  <FormError message={errors.root.auth?.message} />
                </>
              )}
              <Form.Group className="mb-3">
                <ReCAPTCHA
                  sitekey="6Lc3rkUrAAAAAH87zGahNC5WZ_8WE5jS92O4wbmn"
                  ref={recaptcha}
                  theme="dark"
                  onError={() => {}}
                />
              </Form.Group>
              <Button
                type="submit"
                disabled={isSubmitting || !loggedUser}
                form="newEventForm"
              >
                Dodaj termin
              </Button>
            </Form>
          </div>
          <div className={"p-5 " + CalendarPageStyle.rightColumn}>
            <h5>Instrukcje:</h5>
            <p>
              Powyżej jest zamieszczony kalendarz na najbliższe 7 dni. Możesz na
              nim sprawdzić jakie terminy są wolne, jakie zajęte, a w jakich
              terminach są zaplanowane Twoje zajęcia. Możesz także odwołać
              zaplanowane zajęcia.
            </p>
            <h5>Legenda:</h5>
            <p>
              <p className="bg-light-danger p-1 text-dark rounded">
                Zajęty blok
              </p>
              <p className="bg-light-warning p-1 text-dark rounded">
                Twoje zajęcia
              </p>
            </p>
          </div>
        </div>
      </div>
      {showDeleteDialog && (
        <DeleteDialog
          content="Czy na pewno usunąć termin?"
          id={focusedEventId!.id}
          onConfirm={() => {
            onConfirmDelete();
            setShowDeleteDialog(false);
          }}
          onDismiss={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
};

export default CalendarPage;
