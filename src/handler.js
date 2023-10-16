const { nanoid } = require('nanoid');
const { notes } = require('./notes');

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Note has been added',
      data: {
        noteId: id,
      },
    });
    res.code(201);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Note has not been added',
  });
  res.code(500);
  return res;
};

const getAllNotesHandler = (req) => {
  const { tag } = req.query;

  if (tag) {
    const tagFilter = notes.filter((note) => {
      const split = note.title.toLowerCase().split(' ');

      return split.includes(tag.toLowerCase());
    });
    return {
      status: 'success',
      data: {
        notes: tagFilter,
      },
    };
  }
  return {
    status: 'success',
    data: {
      notes,
    },
  };
};

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.filter((value) => value.id === id)[0];
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const res = h.response({
    status: 'fail',
    message: 'Note is not found',
  });
  res.code(404);
  return res;
};

const updateNotByIdHandler = (req, h) => {
  const { id } = req.params;

  const { title, tags, body } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const res = h.response({
      status: 'success',
      message: 'Note has been updated!',
    });
    res.code(200);
    return res;
  }

  const res = h.response({
    status: 'fail',
    message: 'Note has not been updated. Id not found!',
  });
  res.code(404);
  return res;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const index = notes.findIndex((value) => value.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Note has been delete',
    });
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Note has not been delete. Id is not found',
  });
  res.code(404);
  return res;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  updateNotByIdHandler,
  deleteNoteByIdHandler,
};
