import styles from "../styles/Header.module.css";
import navButtonStyles from "../styles/NavButton.module.css";
import * as DiscordUserApi from "../network/discordUser_api"
import { DiscordUser } from "../models/discordUser";
import { useEffect, useState } from "react";
import {getDiscordImage} from '../utils/fetchDiscordImage';
import UserCard from "./partials/userCard";
import LoggedOutCard from "./partials/loggedOutCard";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import FaButton from "./singleComponents/faButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faCalendar, faSearch, faAddressCard, faBars, faX } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  loggedUser: DiscordUser | null,
  onLogoutSuccessful: () => void
}

const Header = ({loggedUser, onLogoutSuccessful} : HeaderProps) => {

  const [hamburgerMenuActive, setHamburgerMenuActive] = useState(false);

  function switchHamburgerMenu() {
    setHamburgerMenuActive(!hamburgerMenuActive);
    if(hamburgerMenuActive) {
      document.body.style.overflow = "";
    }
    else {
      document.body.style.overflow = "hidden";
    }
  }

  let navigate = useNavigate();
  const routeChange = (newPath: string) => {
    navigate(newPath);
  }

  return(
    <>
      <div className={styles.mainContainer}>
        <div className={styles.mainBar}>
          <div className={styles.logoBrandContainer} onClick={() => {routeChange("/"); if(hamburgerMenuActive) {switchHamburgerMenu()}}}>
            Lesson Project
          </div>
          <div className={styles.navigationBar+" d-none d-xl-block"} >
            <ul>
              <li><FaButton iconDef={faDumbbell} className={navButtonStyles.navButton} content="Zadania" faSize="2x" onClick={() => routeChange("/exercises")}/></li>
              <li><FaButton iconDef={faCalendar} className={navButtonStyles.navButton} content="Kalendarz" faSize="2x" onClick={() => routeChange("/calendar")}/></li>
              <li><FaButton iconDef={faAddressCard} className={navButtonStyles.navButton} content="O mnie" faSize="2x" onClick={() => routeChange("/about")}/></li>
              <li><FaButton iconDef={faSearch} className={navButtonStyles.navButton} content="Szukaj" faSize="2x" onClick={() => routeChange("/search")}/></li>
            </ul>
          </div>
          <div className={styles.userCard+" d-none d-xl-block"}>
            {
              loggedUser
              ? <UserCard 
                  user={loggedUser} 
                  onLogoutSuccessful={onLogoutSuccessful}
                />
              : <LoggedOutCard />
            }
          </div>
          <div className={styles.hamburgerButton+" d-xl-none"}>
            <FaButton iconDef={faBars} content="" faSize="2x" onClick={switchHamburgerMenu}/>
          </div>
          {hamburgerMenuActive &&
            <div className={styles.hamburgerMenu+" d-xl-none position-fixed"}>
              <Button 
                className={styles.hamburgerClose + " bg-dark border-light"}
                onClick={() => {switchHamburgerMenu();}}
              ><FontAwesomeIcon icon={faX}/></Button>
              <ul>
                <li><FaButton iconDef={faDumbbell} className={navButtonStyles.navButton+" "+styles.hamburgerMenuItem} content="Zadania" faSize="2x"  onClick={() => {routeChange("/exercises"); switchHamburgerMenu();}}/></li>
                <li><FaButton iconDef={faCalendar} className={navButtonStyles.navButton+" "+styles.hamburgerMenuItem} content="Kalendarz" faSize="2x" onClick={() => {routeChange("/calendar"); switchHamburgerMenu();}}/></li>
                <li><FaButton iconDef={faAddressCard} className={navButtonStyles.navButton+" "+styles.hamburgerMenuItem} content="O mnie" faSize="2x" onClick={() => {routeChange("/about"); switchHamburgerMenu();}}/></li>
                <li><FaButton iconDef={faSearch} className={navButtonStyles.navButton+" "+styles.hamburgerMenuItem} content="Szukaj" faSize="2x" onClick={() => {routeChange("/search"); switchHamburgerMenu();}}/></li>
                <li>
                {
                  loggedUser ? 
                    <UserCard 
                      user={loggedUser} 
                      onLogoutSuccessful={onLogoutSuccessful}
                    /> :
                   <LoggedOutCard />
                }
                </li>
              </ul>
            </div>
          }
          {loggedUser?.isAdmin &&
            <div className={styles.adminButton} onClick={() => routeChange("/admin")}>
              This is some admin button...
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default Header;