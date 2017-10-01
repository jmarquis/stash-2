import Store from "electron-store"

const localData = new Store()
export default localData

console.log(localData.get("spaces"))
