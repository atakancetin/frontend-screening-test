import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll, delayWhen, retryWhen } from 'rxjs/operators';
import { EMPTY, Subject, Observable, OperatorFunction, timer, BehaviorSubject, Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { SocketMessage, SocketMessageType } from "../payload/socketmessage.payload";
export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket$: WebSocketSubject<SocketMessage>;
    private messagesSubject$ = new BehaviorSubject<Observable<SocketMessage>>(EMPTY);
    public messages$ = this.messagesSubject$.pipe(switchAll() as OperatorFunction<any, SocketMessage>, catchError(e => { console.error; throw e }));
    public logoutSubject$ = new Subject();
    private token?: string;



    constructor() {

    }
    public setToken(token?: string) {
        this.token = token;
    }
    public removeToken() {
        delete this.token;
    }
    public connect(token?: string, cfg: { reconnect: boolean } = { reconnect: false }) {
        if (token) {
            this.setToken(token);
            if (!this.socket$ || this.socket$.closed) {
                this.socket$ = this.getNewWebSocket();
            }
            const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
                tap({
                    error: error => console.log(error),
                }), catchError(_ => EMPTY));

            this.messagesSubject$.next(messages);
            this.subscribe();
        }

    }
    private subscribe() {
        this.messages$.subscribe(p => {
            console.log(p);
            if (p.MessageType == SocketMessageType.LogOff) {
                this.logoutSubject$.next();
            }
        });
    }
    private getNewWebSocket() {
        return webSocket<SocketMessage>({
            url: `${WS_ENDPOINT}?${this.token}`,
            closeObserver: {
                next: () => {
                    console.log('[WebSocketService]: connection closed');
                    console.log("token: ", this.token);  
                    this.socket$ = <WebSocketSubject<SocketMessage>><unknown>undefined;
                    if (this.token) {
                        this.connect(this.token, { reconnect: true });
                    }
                }
            }
        });      
    }

    sendMessage(msg: SocketMessage) {
        if (this.socket$) {
            this.socket$.next(msg);
        }
    }
    close() {
        this.socket$.complete();
    }
    private reconnect(observable: Observable<any>): Observable<any> {
        return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[WebSocketService] Try to reconnect', val)),
            delayWhen(_ => timer(RECONNECT_INTERVAL)))));
    }
}