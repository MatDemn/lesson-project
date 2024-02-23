import { ConflictError, ForbiddenError, HttpAPIError, NotFoundError, NotImplementedError, ServerError as InternalServerError, ServiceUnavailableError, UnauthorizedError } from "../errors/http_errors";

export async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if(response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if(response.status === 401) {
            throw new UnauthorizedError(response.status, "Nie jesteś zalogowany/a");
        }
        else if(response.status === 403) {
            throw new ForbiddenError(response.status, "Nie masz dostępu do tego zasobu");
        }
        else if(response.status === 404) {
            throw new NotFoundError(response.status, "Nie odnaleziono zasobu");
        }
        else if(response.status === 409) {
            throw new ConflictError(response.status, "Wystąpił konflikt. Zasób już istnieje");
        }
        else if(response.status === 500) {
            throw new InternalServerError(response.status, "Wewnętrzny błąd serwera");
        }
        else if(response.status === 501) {
            throw new NotImplementedError(response.status, "Funkcjonalność nie została zaimplementowana");
        }
        else if (response.status === 503) {
            throw new ServiceUnavailableError(response.status, "Serwer nie odpowiada. Spróbuj ponownie później");
        }
        else {
            throw new HttpAPIError(response.status, "Nieznany błąd: " + errorMessage);
        }
        
    }
}