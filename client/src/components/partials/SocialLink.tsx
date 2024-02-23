import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import SocialLinkStyles from "../../styles/SocialLink.module.css";


interface SocialLinkProps {
    iconDef: IconDefinition,
    linkName: string,
    linkHref: string,
}

const SocialLink = ({iconDef, linkName, linkHref}: SocialLinkProps) => {
    return ( 
        <Link to={linkHref} className={"text-decoration-none text-info w-25 d-flex gap-3 justify-content-left align-items-center " + SocialLinkStyles.hoverWhite}>
            <FontAwesomeIcon icon={iconDef} size="2x" />
            <span>{linkName}</span>
        </Link>
    );
}
 
export default SocialLink;