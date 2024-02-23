import AboutMePageStyle from "../styles/AboutMePage.module.css";
import profilePic from "../images/profilePic.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";
import SocialLink from "../components/partials/SocialLink";

const AboutMePage = () => {
    return ( 
        <>
        <div className={AboutMePageStyle.content}>
            <div className={AboutMePageStyle.leftColumn}>
                <h1>O mnie</h1>
                <p>
                    Cześć, jestem Mateusz. Zajmuję się programowaniem aplikacji, 
                    tworzeniem materiałów z gier, lektorowaniem i nauczaniem przedmiotów matematykopodobnych.
                    W swojej karierze zawodowej pisałem zarówno soft działający na stacjach GSM,
                    jak i taki uruchamiany na konsolach PlayStation 4/5 czy Nintendo Switch.
                    Strona, na której jesteś jest również moim dziełem, pisanym od podstaw.
                    Poniżej znajdziesz kilka z moich ciekawszych prac, z różnych dziedzin programowania.
                </p>
            </div>
            <div className={AboutMePageStyle.rightColumn}>
                <img src={profilePic} alt="no img"/>
            </div>
        </div> 
        <div className={AboutMePageStyle.mainContent}>
            <h3>Portfolio</h3>
                <section>
                    <h5>
                        <Link to="https://github.com/MatDemn/lesson-project" className="text-warning">
                            Lesson-Project
                        </Link>
                    </h5>
                    <p>
                        Projekt stworzony w stacku technologicznym MERN (MongoDB, Express, React, Node). 
                        Aplikacja internetowa umożliwiająca rezerwowanie terminów
                        zajęć w formie korepetycji i konsultacji, wykorzystująca API Google Calendar.
                        Strona posiada także stale rozwijaną bazę zadań z matematyki, informatyki i innych,
                        pokrewnych zagadnień. Do przechowywania obrazów wykorzystuje API S3 od AWS. 
                        Serwis umożliwia logowanie (SSO) przy pomocy Discorda. 

                        Całość została stworzona z wykorzystaniem wiedzy dostępnej publicznie w serwisie YouTube,
                        a także mojej własnej wiedzy nabytej podczas studiów.
                    </p>
                    <p>
                        <img className="w-100" src="https://github.com/MatDemn/lesson-project/blob/master/screenshots/overview.png?raw=true" alt="lessonProjectImage"/>
                    </p>
                </section>
                <section>
                    <h5>
                        <Link to="https://github.com/MatDemn/FlappyBird" className="text-warning">
                        Flappy Bird
                        </Link>
                    </h5>
                    <p>
                    Proste odwzorowanie gry Flappy Bird z drobnymi różnicami względem oryginału.
                    Pierwotnie projekt był realizowany w ramach zajęć magisterskich na uczelni,
                    później dokończony w celu publikacji na serwisie itch.io.

                    Gra jest stworzona w C#, na silniku Unity. Wszystkie assety użyte w projekcie
                    pochodzą z domen publicznych lub licencji CC, bądź są odwzorowaniami
                    licencjonowanych grafik.
                    </p>
                    <p>
                        <img className="w-100" src="https://github.com/MatDemn/FlappyBird/blob/master/ScreenShots/youTube.png?raw=true" alt="flappyBirdImage"/>
                    </p>
                </section>
                <section>
                    <h5>
                        <Link to="https://github.com/MatDemn/RPGamer" className="text-warning">
                        RPGamer
                        </Link>
                    </h5>
                    <p>
                    Bot dla serwera Discord umożliwiający rozgrywanie oraz organizowanie sesji RPG
                    w sposób zdalny. Główną zaletą jest uproszczenie głosowań na odpowiadające graczom
                    terminy spotkań, jak również podsumowywanie wyników głosowania. Projekt pierwotnie
                    powstawał w wolnym czasie, potem został przekształcony na pracę inżynierską.
                    
                    Kod bota jest napisany w języku Python. Aplikacja korzysta z API Wrappera: discord.py,
                    jak również biblioteki youtube_dl, do streamowania muzyki z serwiu YouTube. Dane aplikacji
                    są przechowywane w relacyjnej bazie danych, PostgreSQL przy użyciu ORM: SQLAlchemy.
                    </p>
                    <p className="bg-white">
                        <img className="h-100" src="https://github.com/MatDemn/Engineer-s-thesis/blob/master/pics/poll_content.PNG?raw=true" alt="rpgamerImage1"/>
                        <img className="h-100" src="https://github.com/MatDemn/Engineer-s-thesis/blob/master/pics/poll_results.png?raw=true" alt="rpgamerImage"/>
                    </p>
                </section>
        </div>
        
        <h3>Kontakt</h3>
        <section className="d-flex justify-content-center">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdqTlasg5jlD64LDg-B8ez3z84kb_m_-_OAKwS6VPc79RFboA/viewform?embedded=true" width="500" height="710">Ładuję…</iframe>
        </section>
        <div className={AboutMePageStyle.footer}>
            <SocialLink iconDef={faLinkedin} linkName={"LinkedIn"} linkHref={"https://www.linkedin.com/in/matezajac/"} />
            <SocialLink iconDef={faGithub} linkName={"GitHub"} linkHref={"https://github.com/MatDemn"} />
            <SocialLink iconDef={faYoutube} linkName={"YouTube"} linkHref={"https://www.youtube.com/channel/UCuul4qJ71KaCSv68zs19-9w"} />
            <SocialLink iconDef={faSpotify} linkName={"Spotify"} linkHref={"https://open.spotify.com/show/0sFcFCM6xOMLrlf0u5sJin"} />
        </div>
    </>
    );
}
 
export default AboutMePage;