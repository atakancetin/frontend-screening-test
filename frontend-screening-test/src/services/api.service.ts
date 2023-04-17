import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse } from 'src/payload/apimessage.payload';

export const API_ENDPOINT = environment.apiEndpoint;
export const LOGIN_ACTION = environment.loginAction;

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private httpClient: HttpClient) {
    }
    public getToken(request: LoginRequest) {
        return this.httpClient.post<LoginResponse>(`${API_ENDPOINT}/${LOGIN_ACTION}`, request);
    }
}