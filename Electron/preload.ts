import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
     ipcRenderer: {
          invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
          on: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.on(channel, listener),
          once: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.once(channel, listener),
     },
});
