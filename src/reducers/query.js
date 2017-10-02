export function query(state = "", action) {
  switch(action.type) {

    case "UPDATE_QUERY":
      return action.query

    default:
      return state

  }
}
