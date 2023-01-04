import {Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';

@Injectable({
  providedIn: 'root'
})
export class IpcRendererService {

  protected readonly ipc: IpcRenderer | undefined = void 0;

  constructor() {
    if (window.require) {
      try {
        this.ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }
}
