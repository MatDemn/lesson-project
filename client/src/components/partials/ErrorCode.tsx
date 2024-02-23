import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface ErrorCodeProps {
    errorCodeNumber: number,
    errorDescription: string,
}

const ErrorCode = ({errorCodeNumber, errorDescription}: ErrorCodeProps) => {
    return ( 
    <div className="d-flex flex-column justify-content-end">
        <h1 className="display-1 text-center text-danger fw-bold">{errorCodeNumber}</h1>
        <h1 className="display-5 text-center">{errorDescription}</h1>
        <Link to={"/"} className="link-light text-center">
            <Button className="mt-5">
                <FontAwesomeIcon icon={faArrowLeft} />
                Powrót
            </Button>
        </Link>
    </div> 
    );
}
 
export default ErrorCode;