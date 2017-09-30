const path = require("path")
const url = require("url")

const { app, BrowserWindow, Tray, globalShortcut } = require("electron")

const WINDOW_WIDTH = 500

let mainWindow, trayIcon

function resetBounds() {
  const bounds = trayIcon.getBounds()
  mainWindow.setPosition((bounds.x + (bounds.width / 2)) - (WINDOW_WIDTH / 2), bounds.y + bounds.height)
}

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

  globalShortcut.register("CommandOrControl+Shift+\\", () => {
    resetBounds()
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  if (process.env.NODE_ENV === "production") {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "build/index.html"),
      protocol: "file:",
      slashes: true
    }))
  } else {
    mainWindow.loadURL("http://localhost:3000")
  }

  mainWindow.on("close", () => mainWindow = null)

  // mainWindow.on("blur", () => mainWindow.hide())

  trayIcon = new Tray(path.join(__dirname, "static/images/tray-icon.png"))

  trayIcon.on("click", (event, bounds) => {
    console.log(bounds)
    resetBounds()
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
})
