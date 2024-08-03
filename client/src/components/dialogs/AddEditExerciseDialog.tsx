import { Button, Form, Modal } from "react-bootstrap";
import {Exercise} from "../../models/exercise";
import { useForm } from "react-hook-form";
import { ExerciseInput } from "../../network/exercises_api";
import * as ExerciseApi from "../../network/exercises_api"
import * as ImageApi from "../../network/image_api";
import { useEffect } from "react";
import { makeNotification } from "../../utils/toastNotification";

interface AddExerciseDialogProps {
    exerciseToEdit?: Exercise,
    onDismiss: () => void,
    onExerciseSaved: (exercise: Exercise) => void,
}

interface ExerciseInputForm {
    title: string;
    description: string;
    images: FileList;
    difficulty: number;
    courseType: string;
    rightAnswer: string;
    tagsString: string;
    deleteImage: boolean;
}

const AddEditExerciseDialog = ({exerciseToEdit, onDismiss, onExerciseSaved}: AddExerciseDialogProps) => {
    
    const { setError, clearErrors, register, handleSubmit, formState : {errors, isSubmitting } } = useForm<ExerciseInputForm>({
        defaultValues: {
            title: exerciseToEdit?.title || "",
            description: exerciseToEdit?.description || "",
            difficulty: exerciseToEdit?.difficulty || 3,
            rightAnswer: exerciseToEdit?.rightAnswer || "",
            tagsString: exerciseToEdit?.tags?.join(",") || "",
        }
    });

    async function onSubmit(input: ExerciseInputForm) {
        try {
            if(exerciseToEdit?.imagePath && (input.deleteImage || input.images.length > 0)) {
                const imageId = exerciseToEdit.imagePath.split("/").pop();
                if(!imageId) {
                    throw new Error("Wrong imageId in imagePath!");
                }
                console.log("befor response");
                await ImageApi.delImage(imageId);
                console.log("after the response");
            }

            let imageURL = exerciseToEdit?.imagePath || "";
            if(input.images.length !== 0) {

                // Secure URL for image
                const secureURL = await ImageApi.getSecurePostURL();
                
                // PUT image to S3
                const resp = await ImageApi.putImage(secureURL, input?.images[0]);
                imageURL = secureURL.split('?')[0];
            }
            // Save all other data to mongo
            const newExercise: ExerciseInput = {
                title: input.title,
                description: input.description,
                imagePath: imageURL,
                difficulty: input.difficulty,
                courseType: input.courseType,
                rightAnswer: input.rightAnswer,
                tags: input.tagsString.replace(/\s/g, '').split(","),
            }
            let exerciseResponse : Exercise;
            if(exerciseToEdit) {
                exerciseResponse = await ExerciseApi.updateExercise(exerciseToEdit._id, newExercise);
            }
            else {
                exerciseResponse = await ExerciseApi.createExercise(newExercise);
            }
            onExerciseSaved(exerciseResponse);
            
        } catch (error) {
            console.error(error);
            makeNotification(""+error, "Error");
        }
    }

    function checkFileSize(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            clearErrors("images");
            return;
        }
        const maxSize = 1000000;
        if(e.target.files[0].size <= maxSize) {
            clearErrors("images");
        }
        else {
            setError("images", { type: 'custom', message: 'File is too big! Max. 1MB.'});
        }
    }

    useEffect(() => console.log(exerciseToEdit), [exerciseToEdit]);

    return ( 
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton className="bg-dark" >
                <Modal.Title >{exerciseToEdit ? "Edit Exercise" : "Add Exercise"}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-dark">
                <Form id="addExerciseForm" onSubmit={handleSubmit(onSubmit)} > 
                    <Form.Group className="mb-3" >
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Some title" 
                            isInvalid={!!errors.title}
                            {...register("title", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description </Form.Label> 
                        <Form.Control 
                            as="textarea" 
                            rows={5} 
                            placeholder="Some description" 
                            isInvalid={!!errors.description}
                            {...register("description", { required: "Required" })}
                        /> 
                        <Form.Control.Feedback type="invalid">
                            {errors.description?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label> 
                        <Form.Control 
                            type="file" 
                            accept="image/png, image/jpeg"
                            isInvalid={!!errors.images}
                            {...register("images")}
                            onChange={checkFileSize}
                        /> 
                        <Form.Control.Feedback type="invalid">
                            {errors.images?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Difficulty</Form.Label> 
                        <Form.Range 
                            min={1} 
                            max={5} 
                            step={1} 
                            {...register("difficulty")}
                        /> 
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Course Type</Form.Label> 
                        <Form.Select {...register("courseType")}>
                            <option value="maths">Maths</option>    
                            <option value="computerScience">Computer Science</option>   
                            <option value="other">Other</option>  
                        </Form.Select> 
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Right Answer </Form.Label> 
                        <Form.Control 
                            as="textarea" 
                            rows={5} 
                            placeholder="Right answer" 
                            {...register("rightAnswer")}
                        /> 
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label> 
                        <Form.Control 
                            type="text" 
                            placeholder="" 
                            {...register("tagsString")}
                        />
                        <Form.Text className="text-white-50">
                            Put all tags separated with commas
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            {errors.tagsString?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Form.Check 
                    type="checkbox"
                    disabled={!exerciseToEdit || !exerciseToEdit?.imagePath}
                    {...register("deleteImage")}
                />
                <Form.Text className={(!exerciseToEdit || !exerciseToEdit?.imagePath) ? "text-white-50" : "text-white"}>
                    Delete image
                </Form.Text>
                <Button 
                    type="submit" 
                    form="addExerciseForm"
                    disabled={isSubmitting}
                >Save</Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddEditExerciseDialog;