import { Button, Nav, Navbar } from "react-bootstrap";
import * as DiscordUserApi from "../../network/discordUser_api";
import { DiscordUser } from "../../models/discordUser";
import { getDiscordImage } from "../../utils/fetchDiscordImage";
import headerStyles from "../../styles/Header.module.css";
import userCardStyles from "../../styles/UserCard.module.css";
import { useState } from "react";
import "../../styles/UserCard.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCalendar } from '@fortawesome/free-solid-svg-icons';
import FaButton from "../singleComponents/faButton";
import { makeNotification } from "../../utils/toastNotification";

interface UserCardProps {
    user: DiscordUser,
    onLogoutSuccessful: () => void,
    className?: string,
}

const UserCard = ({user, onLogoutSuccessful, className}: UserCardProps) => {
    async function logout() {
        let response;
        try{
          response = await DiscordUserApi.logoutAuthenticatedUser();
          console.log("Użytkownik wylogowany");
          makeNotification("Użytkownik wylogowany", "Info");
          onLogoutSuccessful();
        }
        catch(error) {
          switch(response?.status) {
            case 401:
            case 200:
              console.log("Użytkownik wylogowany");
              makeNotification("Użytkownik wylogowany", "Info");
              onLogoutSuccessful();
              break;
            default:
              console.log(response);
              console.log(error);
              makeNotification(""+error, "Error");
          }
        }
      }

    const userAvatarSrc = getDiscordImage(user);
    return ( 
        <>
            <div className={userCardStyles.navBar + " " + className}>
                <div className={userCardStyles.avatarButton}>
                    <div className={userCardStyles.profileInfo}>
                        <div className={userCardStyles.userName} >
                            {user.global_name} 
                        </div>
                        <div className={userCardStyles.logout} onClick={logout}>
                            Wyloguj
                        </div>
                    </div>
                    <img src={userAvatarSrc} alt="avatar" className={userCardStyles.headerAvatar}/>
                </div>
            </div>
            
        </>
     );
}
 
export default UserCard;