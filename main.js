const path = require("path")
const url = require("url")

const { app, BrowserWindow, Tray, globalShortcut } = require("electron")

const WINDOW_WIDTH = 600
const WINDOW_HEIGHT = 400

let mainWindow, trayIcon

function resetBounds() {
  const bounds = trayIcon.getBounds()
  mainWindow.setPosition((bounds.x + (bounds.width / 2)) - (WINDOW_WIDTH / 2), bounds.y + bounds.height)
}

function showWindow() {
  mainWindow.show()
  trayIcon.setHighlightMode("always")
  mainWindow.webContents.send("focus-search")
}

function hideWindow() {
  mainWindow.hide()
  trayIcon.setHighlightMode("selection")
}

function toggleWindow() {
  mainWindow.isVisible() ? hideWindow() : showWindow()
}

app.on("ready", () => {

  // if (process.platform === "darwin") app.dock.hide()

  mainWindow = new BrowserWindow({
    title: "Scratch",
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizable: false,
    frame: false,
    vibrancy: "light",
    transparent: true,
    show: false
  })

  globalShortcut.register("CommandOrControl+Shift+\\", () => {
    resetBounds()
    toggleWindow()
  })

  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "electron") {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "build/index.html"),
      protocol: "file:",
      slashes: true
    }))
  } else {
    mainWindow.loadURL("http://localhost:3000")
  }

  mainWindow.on("close", () => mainWindow = null)

  // mainWindow.on("blur", () => hideWindow())

  trayIcon = new Tray(path.join(__dirname, "static/images/tray-icon.png"))

  trayIcon.on("click", (event, bounds) => {
    resetBounds()
    toggleWindow()
  })
})
