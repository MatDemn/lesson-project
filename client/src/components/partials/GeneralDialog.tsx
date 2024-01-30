import { Button, Modal } from "react-bootstrap";

interface GeneralDialogProps {
    title: string,
    confirmLabel: string,
    dismissLabel: string,
    onDismiss: () => void,
    onConfirm: () => void,
}

const GeneralDialog = ({title, confirmLabel, dismissLabel, onDismiss, onConfirm}: GeneralDialogProps) => {
    return ( 
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex gap-5 justify-content-center">
                <Button variant="primary">{dismissLabel}</Button>
                <Button variant="danger">{confirmLabel}</Button>

            </Modal.Body>
        </Modal>
     );
}
 
export default GeneralDialog;