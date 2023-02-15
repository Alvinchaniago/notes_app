import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

/* PROJECT IMPORT */
import Note from "./Note";
import * as NotesApi from "../network/notes_api";
import { Note as NoteModel } from "../models/note";
import AddEditNoteDialog from "./AddEditNoteDialog";
import styleUtils from "../styles/utils.module.css";
import styles from "../styles/NotesPage.module.css";

const NotesPageLoggedInView = () => {
  /* =============================== NOTE =============================== */
  /* THE NOTES STATE SHOULD BE AN ARRAY OF NOTES */
  /* LOAD ONCE WHEN THE APP STARTS THROUGH USE EFFECTS - PASS AN EMPTY ARRAY TO DO SO */
  /* USE EFFECTS PERFORMS SIDE EFFECTS SEPARATE FROM COMPONENTS RENDERING */
  /* THIS ALLOWS WHEN TO EXECUTE AND HOW OFTEN */

  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter((currentNote) => currentNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <>
      <Button
        className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(!showAddNoteDialog)}
      >
        <FaPlus />
        Add New Note
      </Button>
      {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && (
        <p>Something went wrong. Please refresh the page.</p>
      )}
      {!notesLoading && !showNotesLoadingError && (
        <>
          {notes.length > 0 ? (
            <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
              {notes.map((note) => (
                <Col key={note._id}>
                  <Note
                    note={note}
                    className={styles.note}
                    onDeleteNoteClicked={deleteNote}
                    onNoteClicked={setNoteToEdit}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <p>You don't have any note written.</p>
          )}
        </>
      )}

      {showAddNoteDialog && (
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(!showAddNoteDialog)}
          onNoteSave={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(!showAddNoteDialog);
          }}
        />
      )}
      {noteToEdit && (
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSave={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id
                  ? updatedNote
                  : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default NotesPageLoggedInView;
