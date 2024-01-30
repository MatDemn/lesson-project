import { fetchData } from "./networkUtils";

export async function fetchImage(imageId: string) {
    const response = await fetchData(`/api/image/${imageId}`, { method: "GET" });
    return response.json();
}

export async function getSecurePostURL() {
    const response = await fetchData('/api/image/secureURL', {method: "GET"});
    return response.json();
}

export async function putImage(secureURL: string, file: File) {
    const response = await fetchData(secureURL, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: file
    });
    console.log("put:");
    console.log(response);
    return response;
}

export async function delImage(imageId: string) {
    await fetchData(`/api/image/${imageId}`, {method: "DELETE"});
}