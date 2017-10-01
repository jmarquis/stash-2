export function updateNote(noteId, noteContent) {
  return {
    type: "UPDATE_NOTE",
    noteId,
    noteContent
  }
}
