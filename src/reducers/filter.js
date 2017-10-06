export function filter(state = "all", action) {
  switch (action.type) {

    case "UPDATE_FILTER":
      return action.filter

    default:
      return state

  }
}
