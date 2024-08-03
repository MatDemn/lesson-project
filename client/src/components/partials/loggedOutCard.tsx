import { Button, Nav, NavLink } from "react-bootstrap";
import loggedOutCardStyles from "../../styles/LoggedOutCard.module.css";
import { Link } from "react-router-dom";
import * as DiscordUserApi from "../../network/discordUser_api";

const LoggedOutCard = () => {
    return ( 
        <div className={loggedOutCardStyles.container}>
            <div className={loggedOutCardStyles.button} onClick={DiscordUserApi.loginWithDiscord}>
                    <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg" alt="" />
                    Zaloguj
            </div>
        </div>
     );
}
 
export default LoggedOutCard;