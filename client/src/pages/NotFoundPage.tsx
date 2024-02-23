import ErrorCode from "../components/partials/ErrorCode";

const NotFoundPage = () => {
    return ( 
        <>
            <ErrorCode errorCodeNumber={404} errorDescription={"Nie znaleziono tego zasobu!"} /> 
        </> 
    );
}
 
export default NotFoundPage;