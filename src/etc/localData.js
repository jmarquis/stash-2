import Store from "electron-store"
import uuid from "uuid/v4"
import moment from "moment"
import { ContentState, convertToRaw } from "draft-js"

const localData = new Store()

const spaces = localData.get("spaces")
const notes = localData.get("notes")

if (!spaces || !notes) {
  const spaceId = uuid()
  localData.set({
    spaces: {
      [spaceId]: {}
    },
    notes: {
      [uuid()]: {
        spaceId,
        lastModified: moment(),
        contentState: JSON.stringify(convertToRaw(ContentState.createFromText("Welcome to Backslash!")))
      }
    }
  })
}

export default localData
