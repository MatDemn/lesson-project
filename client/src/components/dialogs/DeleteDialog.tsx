import { Button, Form, Modal } from "react-bootstrap";

interface DeleteDialogProps {
    id: string,
    content: string,
    onConfirm: () => void,
    onDismiss: () => void,
}

const DeleteDialog = ({id, content, onConfirm, onDismiss}: DeleteDialogProps) => {
    return ( <>
        <Modal show centered >
            <Modal.Body className="bg-dark">
                <div className="d-flex justify-content-center mb-3">{content}</div>
                <div className="d-flex justify-content-center gap-5">
                    <Button variant="primary" onClick={() => onDismiss()}>Nie</Button>
                    <Button variant="danger" onClick={() => onConfirm()}>Tak</Button>
                </div>
            </Modal.Body>
        </Modal>
    </> );
}
 
export default DeleteDialog;