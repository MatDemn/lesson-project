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

interface UserCardProps {
    user: DiscordUser,
    onLogoutSuccessful: () => void,
}

const UserCard = ({user, onLogoutSuccessful}: UserCardProps) => {
    async function logout() {
        try {
            await DiscordUserApi.logoutauthenticatedUser();
            onLogoutSuccessful();
        } catch (error) {
            alert(error);
        }
    }

    const userAvatarSrc = getDiscordImage(user);
    return ( 
        <>
            <div className={userCardStyles.navBar}>
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