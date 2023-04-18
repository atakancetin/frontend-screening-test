import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResult, LoginRequest, LoginResponse } from 'src/payload/apimessage.payload';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

export const API_ENDPOINT = environment.apiEndpoint;
export const LOGIN_ACTION = environment.loginAction;
export const GREETING_ACTION = environment.greetingAction;

@Injectable({
    providedIn: 'root'
})
export class ApiService {  
    constructor(private httpClient: HttpClient) {        
    }
    public getToken(request: LoginRequest) {
        return this.httpClient.post<LoginResponse>(`${API_ENDPOINT}/${LOGIN_ACTION}`, request);
    }
    public getWelcomeMessage() {         
        return this.httpClient.get<ApiResult>(`${API_ENDPOINT}/${GREETING_ACTION}`);
    }
}