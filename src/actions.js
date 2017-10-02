import { throttle } from "lodash"

import localData from "etc/localData"

function updateNote(noteId, noteData) {
  return {
    type: "UPDATE_NOTE",
    noteId,
    noteData
  }
}

function persistContentState(noteId, contentState) {
  localData.set(`notes.${noteId}.contentState`, contentState)
}

const throttledPersistContentState = throttle(persistContentState, 500)

export function updateContentState(noteId, contentState) {
  throttledPersistContentState(noteId, contentState)
  return updateNote(noteId, { contentState })
}

export function updateQuery(query) {
  return {
    type: "UPDATE_QUERY",
    query
  }
}
