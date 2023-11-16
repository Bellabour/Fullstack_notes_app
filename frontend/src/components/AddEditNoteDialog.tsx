import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import * as CategoriesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";


interface Category {
    _id: string;
    name: string;
    // Add other category-related fields if needed
}
interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const selectRef = useRef<HTMLSelectElement>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || "",
        }
    });
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await CategoriesApi.fetchCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);
    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;
            if (noteToEdit) {
                // Update note with selected categories
                noteResponse = await NotesApi.updateNoteWithCategories(noteToEdit._id, input, selectedCategories, []);
            } else {
                // Create note with selected categories
                noteResponse = await NotesApi.createNote(input);
            }
            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }


    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit note" : "Add note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Title"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.title}
                    />

                    <TextInputField
                        name="text"
                        label="Text"
                        as="textarea"
                        rows={5}
                        placeholder="Text"
                        register={register}
                    />

                    {/* Category dropdown */}
                    <Form.Group controlId="categoryDropdown">
                        <Form.Label>Categories</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            ref={selectRef}
                            value={selectedCategories}
                            onChange={() => {
                                if (selectRef.current) {
                                    const selectedOptions = Array.from(selectRef.current.selectedOptions).map((option) => option.value);
                                    setSelectedCategories(selectedOptions);
                                }
                            }}
                        >
                            {categories.map((category) => (
                                <option key={category._id} value={category._id} selected={selectedCategories.includes(category._id)}>
                                    {category.name}
                                </option>
                            ))}
                        </Form.Control>


                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditNoteForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
};
export default AddEditNoteDialog;