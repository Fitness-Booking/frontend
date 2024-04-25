import { Injectable } from '@angular/core';
@Injectable()
export class LogService {
  log(msg: any) {
    console.log(new Date().toLocaleTimeString() + ": \n" + JSON.stringify(msg));
  }

  error(msg: any, error: any) {
    console.error(new Date().toLocaleTimeString() + ": \n" + JSON.stringify(msg) + "\n" + JSON.stringify(error));
  }
}
