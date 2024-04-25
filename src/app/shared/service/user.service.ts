import { UserRegisterModel } from '../../model/user/register.model';
import { UserLoginModel } from '../../model/user/login.model';
import { LogService } from './log.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagerApiService } from '../api/userManagerApi.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserRequest } from 'src/app/model/requests/user.request';
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private userService: UserManagerApiService,
    public router: Router,
    private log: LogService,
    private jwtHelper: JwtHelperService
  ) {}


  signIn(email: string, password: string): Observable<any> {
    const user = new UserLoginModel(email, password);
    return this.userService.postLogin(user);
  }

  public signUp(
    email: string,
    username: string,
    password: string,
    repeatPassword: string,
    roleId: number
  ): Observable<any> {
    const registerUser = new UserRegisterModel(
      email,
      username,
      password,
      repeatPassword,
      roleId
    );

    return this.userService.putRegistration(registerUser);
  }
  public get(id?: number, roleId?: number, name?: string, email?:string ){
    const request = new UserRequest(id, roleId, name, email);
  console.log(request);
    return this.userService.get(request);
  }
  public logOut() {
    localStorage.removeItem('access_token');
  }
  hasRestrictions(pageRestrictions: string[]): boolean {
    let result = false;
    const token = localStorage.getItem('access_token');
    if (token) {
      const restriction: string = this.jwtHelper.decodeToken(token).grants;
      if (pageRestrictions && pageRestrictions.length > 0) {
        if (restriction) {
          for (let i = 0; i < pageRestrictions.length; ++i) {
            pageRestrictions[i] = pageRestrictions[i].toLowerCase();
          }
          result = pageRestrictions.includes(restriction.toLowerCase());
        }
      } else {
        result = true;
      }
    }

    return result;
  }
  getUserId(): string {
    let result = ""
    const token = localStorage.getItem('access_token');
    if (token) {
      result = this.jwtHelper.decodeToken(token).sub;
      }
    return result;
  }
}
