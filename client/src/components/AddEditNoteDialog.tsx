import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

/* PROJECT IMPORT */
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
  noteToEdit?: Note;
  onDismiss: () => void;
  onNoteSave: (note: Note) => void;
}

const AddEditNoteDialog = ({
  noteToEdit,
  onDismiss,
  onNoteSave,
}: AddEditNoteDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    },
  });

  async function onSubmit(input: NoteInput) {
    try {
      let noteResponse;
      if (noteToEdit) {
        noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
      } else {
        noteResponse = await NotesApi.createNote(input);
      }
      onNoteSave(noteResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{noteToEdit ? "Edit Note" : "Add New Note"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Note Title"
            register={register}
            registerOptions={{ required: "Title Required" }}
            error={errors.title}
          />
          {/* ROWS SET THE TEXT AREA SIZE */}
          <TextInputField
            name="text"
            label="Text"
            as="textarea"
            rows={5}
            placeholder="Add your note here..."
            register={register}
          />
        </Form>
      </Modal.Body>
      {/* SINCE BUTTON IS INSIDE FOOTER, ADD AN ID AND CONNECT IT TO THE FORM ABOVE */}
      {/* ISSUBMITTING DISABLES THE BUTTON FOR A BRIEF MOMENT DURING SAVE */}
      <Modal.Footer>
        <Button type="submit" form="addEditNoteForm" disabled={isSubmitting}>
          Save Note
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditNoteDialog;
