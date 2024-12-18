import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, screen } from 'electron';
import path from 'path';
import { isDev } from './config';
import { appConfig } from './ElectronStore/Configuration';
import AppUpdater from './AutoUpdate';
import { createObjectCsvWriter } from 'csv-writer';
import { insertData, showAllDates, dropTable } from '../models/database';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Define the output directory based on the current date
const date = new Date();
const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
     .getDate()
     .toString()
     .padStart(2, '0')}`;
const outputDir = path.join(__dirname, 'date_generated', dateString);

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
     fs.mkdirSync(outputDir, { recursive: true });
}

const csvWriter = createObjectCsvWriter({
     path: path.join(outputDir, `${dateString}.csv`),
     header: [
          { id: 'name', title: 'Name' },
          { id: 'quantity', title: 'Quantity' },
     ],
     append: true,
     fieldDelimiter: ',',
});

let itemCount = 0;
ipcMain.handle('insert-data', async (event, item) => {
     try {
          await csvWriter.writeRecords([{ name: item.name, quantity: item.quantity }]);
          itemCount++;
          insertData(item);
          if (itemCount % 14 === 0) {
               // Add a blank line after every 14 items
               await csvWriter.writeRecords([{}]);
               showAllDates();
          }

          return { success: true };
     } catch (error) {
          console.error('Error inserting data:', error);
          return { success: false, error: (error as Error).message };
     }
});

//  Electron configuration

async function createWindow() {
     const { width, height } = screen.getPrimaryDisplay().workAreaSize;
     const appBounds: any = appConfig.get('setting.appBounds');
     const BrowserWindowOptions: BrowserWindowConstructorOptions = {
          width: 1000,
          minWidth: 900,
          height: 600,
          minHeight: 600,

          webPreferences: {
               preload: __dirname + '/preload.js',
               devTools: isDev,
          },
          show: false,
          alwaysOnTop: true,
          frame: true,
     };

     if (appBounds !== undefined && appBounds !== null) Object.assign(BrowserWindowOptions, appBounds);
     const mainWindow = new BrowserWindow(BrowserWindowOptions);
     
     // auto updated
     if (!isDev) AppUpdater();

     // and load the index.html of the app.
     // win.loadFile("index.html");
     await mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`);

     if (appBounds !== undefined && appBounds !== null && appBounds.width > width && appBounds.height > height)
          mainWindow.maximize();
     else mainWindow.show();

     // this will turn off always on top after opening the application
     setTimeout(() => {
          mainWindow.setAlwaysOnTop(false);
     }, 1000);

     ipcMain.handle('versions', () => {
          return {
               node: process.versions.chrome,
               chrome: process.versions.chrome,
               electron: process.versions.electron,
               version: app.getVersion(),
               name: app.getName(),
          };
     });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
     // if dev
     if (isDev) {
          try {
               const { installExt } = await import('./installDevTool');
               await installExt();
          } catch (e) {
               console.log('Can not install extension!');
          }
     }

     createWindow();
     app.on('activate', function () {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (BrowserWindow.getAllWindows().length === 0) createWindow();
     });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
          app.quit();
     }
});
