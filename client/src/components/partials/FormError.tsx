import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FaButton from "../singleComponents/faButton";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

interface FormErrorProps {
    message: string | undefined,
}

const FormError = ({message}: FormErrorProps) => {

    const [isShown, setIsShown] = useState(true);

    return (
        <>
            {isShown && <div className="d-flex justify-content-between p-3 mb-2 mt-2 bg-danger text-white">
                {message}
                <FontAwesomeIcon icon={faXmark} size="xl" onClick={() => setIsShown(false)}/>
                </div>}
        </>
    );
}
 
export default FormError;