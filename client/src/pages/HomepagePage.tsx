import { useEffect, useRef, useState } from "react";
import homePageStyles from "../styles/HomepagePage.module.css";
import ExerciseBar from "../components/partials/ExerciseBar";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { makeNotification } from "../utils/toastNotification";

const HomepagePage = () => {
    return (
        <>
            <h1 className={homePageStyles.logo + " text-center"}>Lesson Project</h1>
            <p>
                <div>
                    Witam Cię! Jeśli tu przybyłeś/aś zapewne chcesz zarezerwować termin
                    kolejnych zajęć, przejrzeć zadania lub dowiedzieć się więcej o mnie. Rozgość się proszę,
                    a w razie pytań wyślij mi zapytanie przez formularz.
                </div>
                <div className="d-flex flex-column justify-items-center mt-5">
                    <Button><Link to="/about" className="text-light text-decoration-none">Kontakt</Link></Button>
                </div>
            </p>
        </>
    );
}
 
export default HomepagePage;