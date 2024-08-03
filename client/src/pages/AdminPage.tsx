import { Button } from "react-bootstrap";
import AddEditExerciseDialog from "../components/dialogs/AddEditExerciseDialog";
import React from "react";
import { DiscordUser } from "../models/discordUser";
import { Navigate } from "react-router-dom";

interface AdminPageProps {
    loggedUser?: DiscordUser | null,
}

const AdminPage = ({loggedUser} : AdminPageProps) => {
    
    const [showAddExerciseDialog, setShowAddExerciseDialog] = React.useState(false);
    console.log(loggedUser);
    return ( 
        <>
        {
            !loggedUser?.isAdmin ?
            <Navigate to="/forbidden" replace /> :

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
        }
        </>
    );
}
 
export default AdminPage;