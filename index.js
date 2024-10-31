const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow; // Déclaration d'une variable pour la fenêtre principale

function createWindow() {
    if (mainWindow) { // Vérifie si la fenêtre existe déjà
        mainWindow.focus(); // Focalise la fenêtre existante
        return;
    }

    mainWindow = new BrowserWindow({ // Associe la fenêtre à la variable
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'favicon.ico')
    });

    // Supprimer la barre de menu
    Menu.setApplicationMenu(null);
    // mainWindow.webContents.openDevTools()
    mainWindow.loadFile('index.html');
}

// app.whenReady().then(() => {
//     app.setAutoUpdaterEnabled(false);
//     createWindow();
// });

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});