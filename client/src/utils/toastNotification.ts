import { Bounce, ToastOptions, toast } from "react-toastify";

export type NotifType = "Info" | "Warning" | "Error" | "Default";

const toastOptions: ToastOptions<unknown> = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
}

export function makeNotification(content: string, type: NotifType) {
    switch(type) {
        case "Info":
            toast.info(content, toastOptions);
            break;
        case "Warning":
            toast.warning(content, toastOptions);
            break;
        case "Error":
            toast.error(content, toastOptions);
            break;
        default:
            toast(content,toastOptions);
            break;
    }
}