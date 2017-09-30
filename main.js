const path = require("path")
const url = require("url")

const { app, BrowserWindow, Tray } = require("electron")

const WINDOW_WIDTH = 500

let mainWindow

app.on("ready", () => {

  if (process.platform === "darwin") app.dock.hide()

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: 400,
    resizable: false,
    frame: false,
    transparent: false,
    show: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "build/index.html"),
    protocol: "file:",
    slashes: true
  }))

  mainWindow.on("close", () => mainWindow = null)

  mainWindow.on("blur", () => mainWindow.hide())

  const tray = new Tray(path.join(__dirname, "static/images/tray-icon.png"))

  tray.on("click", (event, bounds) => {
    console.log(bounds)
    mainWindow.setPosition((bounds.x + (bounds.width / 2)) - (WINDOW_WIDTH / 2), bounds.y + bounds.height)
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
})
