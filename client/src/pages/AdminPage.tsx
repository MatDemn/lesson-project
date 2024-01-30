import { Button } from "react-bootstrap";
import AddEditExerciseDialog from "../components/AddEditExerciseDialog";
import React from "react";

const AdminPage = () => {
    
    const [showAddExerciseDialog, setShowAddExerciseDialog] = React.useState(false);

    return ( 
    <>
        Some example admin content...
        <Button className="mb-4" onClick={() => setShowAddExerciseDialog(true)}>New exercise</Button>

        { showAddExerciseDialog && 
            <AddEditExerciseDialog 
                onDismiss={() => setShowAddExerciseDialog(false)}
                onExerciseSaved={(exercise) => {
                    setShowAddExerciseDialog(false);
                }}
            />
            }
    </> 
    );
}
 
export default AdminPage;