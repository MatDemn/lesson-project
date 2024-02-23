import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface FaControlButtonProps {
    icon: IconProp,
    onClick?: () => void,
    className?: string, 
}

const FaControlButton = ({icon, onClick, className}: FaControlButtonProps) => {
    return ( 
        <FontAwesomeIcon icon={icon} onClick={onClick} className={className} />
     );
}
 
export default FaControlButton;