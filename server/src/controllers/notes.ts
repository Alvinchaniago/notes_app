import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";

/* PROJECT IMPORT */
import NoteModel from "../models/note";
import { assertIsDefined } from "../util/assertIsDefined";

/* THIS FUNCTION IS OF TYPE REQUESTHANDLER */
export const getNotes: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(notes);
  } catch (error) {
    /* CALL THE ERROR HANDLING FUNCTION */
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  /* GET NOTE ID */
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note ID");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    /* CHECK IF THE NOTE BELONGS TO A USER */
    /* COMPARE USER ID WITH AUTHENTICATEDUSERID THROUGH EQUALS METHOD */
    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

/* TYPES OF THE BODY */
/* QUESTION MARK MEANS OPTIONAL */
interface CreateNoteBody {
  title?: string;
  text?: string;
}

/* REQ BODY IS MARKED AS THE INTERFACE ABOVE */
/* LAST TYPE (AFTER THE CREATENOTEBODY FOR THE REQ BODY) IS FOR URL PARAMS (IN THIS CASE THE NOTE ID) */
/* UNKNOWN IS SAFER IN GENERAL COMPARED TO ANY TYPE SINCE IT IS MORE RESTRICTIVE */
export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  /* EXTRACT THE TITLE AND TEXT FROM THE BODY */
  const title = req.body.title;
  const text = req.body.text;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }
    const newNote = NoteModel.create({
      userId: authenticatedUserId,
      title: title,
      text: text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

/* ID NEEDS TO HAVE AN INTERFACE FOR THE PATCH REQUEST */
/* THIS IS BECAUSE IT CANNOT BE UNKNOWN SET FOR ITS TYPE */
interface UpdateNoteParams {
  noteId: string;
}

interface UpdateNoteBody {
  title?: string;
  text?: string;
}

/* PATCH */
export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note ID");
    }
    if (!newTitle) {
      throw createHttpError(400, "Note must have a title");
    }

    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note ID");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }
    await note.remove();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
