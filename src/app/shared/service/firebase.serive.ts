import { initializeApp } from "firebase/";
import { getAnalytics } from "firebase/analytics";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    constructor() {
        firebase.initializeApp(environment.firebase)
    }
}