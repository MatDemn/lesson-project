import { Button } from "react-bootstrap";
import ErrorCode from "../components/partials/ErrorCode"
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
    return ( 
        <>
            <ErrorCode errorCodeNumber={403} errorDescription={"Nie masz dostępu do tego zasobu!"} /> 
        </>
    );
}
 
export default ForbiddenPage;