import faButtonStyles from "../../styles/faButton.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

interface faButtonProps {
    iconDef: IconDefinition,
    content: string,
    className?: string,
    faSize?: SizeProp,
    onClick?: () => void,
}

const FaButton = ({iconDef, content, className, faSize, onClick}: faButtonProps) => {
    return ( 
        <div className={faButtonStyles.button+" "+className} onClick={onClick}>
            <FontAwesomeIcon icon={iconDef} size={faSize || "1x"} />
            {content}
        </div>
     );
}
 
export default FaButton;