export function notes(state = {}, action) {
  switch (action.type) {

    case "UPDATE_NOTE":
      return {
        ...state,
        [action.noteId]: {
          ...state[action.noteId],
          ...action.noteData
        }
      }

    default:
      return state

  }
}
