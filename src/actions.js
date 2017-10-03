import { throttle } from "lodash"
import uuid from "uuid/v4"
import { ContentState, convertToRaw } from "draft-js"
import moment from "moment"

import localData from "etc/localData"

function updateNote(noteId, noteData) {
  return {
    type: "UPDATE_NOTE",
    noteId,
    noteData
  }
}

function persistContentState(noteId, contentState) {
  localData.set(`notes.${noteId}.contentState`, JSON.stringify(convertToRaw(contentState)))
}

const throttledPersistContentState = throttle(persistContentState, 500)

export function updateEditorState(noteId, editorState) {
  throttledPersistContentState(noteId, editorState.getCurrentContent())
  return updateNote(noteId, { editorState })
}

export function updateQuery(query) {
  return {
    type: "UPDATE_QUERY",
    query
  }
}

export function createNote(spaceId) {
  const noteId = uuid()
  const noteData = {
    spaceId,
    lastUpdated: moment(),
    contentState: JSON.stringify(convertToRaw(ContentState.createFromText("")))
  }
  localData.set(`notes.${noteId}`, noteData)
  return updateNote(noteId, noteData)
}
