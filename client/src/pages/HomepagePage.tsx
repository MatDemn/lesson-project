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
                Hej! Skoro już tu jesteś, to pewnie chcesz zarezerwować termin naszych zajęć, 
                sprawdzić zadania lub dowiedzieć się czegoś więcej. 
                Czuj się jak u siebie i w razie jakichkolwiek pytań, 
                śmiało pisz do mnie poprzez „kontakt”, postaram się odpisać tak szybko jak mogę 😀
                </div>
                <div className="d-flex flex-column justify-items-center mt-5">
                    <Button><Link to="/about" className="text-light text-decoration-none">Kontakt</Link></Button>
                </div>
            </p>
        </>
    );
}
 
export default HomepagePage;