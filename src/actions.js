function updateNote(noteId, noteData) {
  return {
    type: "UPDATE_NOTE",
    noteId,
    noteData
  }
}

export function updateContentState(noteId, contentState) {
  return updateNote(noteId, { contentState })
}
