import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll, delayWhen, retryWhen } from 'rxjs/operators';
import { EMPTY, Subject, Observable, OperatorFunction, timer, BehaviorSubject } from 'rxjs';
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
    constructor() {
    }
    public connect(token: string, cfg: { reconnect: boolean } = { reconnect: false }) {
        if (!this.socket$ || this.socket$.closed) {
            this.socket$ = this.getNewWebSocket(token);
            const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
                tap({
                    error: error => console.log(error),
                }), catchError(_ => EMPTY));
            this.messagesSubject$.next(messages);
            this.subscribe();
        }

    }
    private subscribe() {
        // if (!this.socket$ || !this.socket$.closed) {
        //     this.socket$.subscribe(p => console.log("socket sub: ", p));
        this.messages$.subscribe(p => {
            console.log(p);
            if (p.MessageType == SocketMessageType.LogOff) {
                this.logoutSubject$.next();
            }
        });
        //  this.sendMessage({MessageType: 1});
        //this.sendMessage({ MessageType: 0 });
        //  this.sendMessage({MessageType: 1});
        // setTimeout(() => {
        //     this.messages$.subscribe(p => console.log("message sub 2:", p));
        //     this.sendMessage({ MessageType: 0 });
        //     this.messages$.subscribe(p => console.log("message sub 3:", p));            
        // }, 1000)

        // }
    }
    private getNewWebSocket(token: string) {
        return webSocket<SocketMessage>({
            url: `${WS_ENDPOINT}?${token}`,
            //serializer: msg => JSON.stringify(msg),
            //deserializer: ({ data }) => JSON.parse(data),
            // openObserver: {
            //     next: () => {
            //         this.socket$.subscribe();
            //     }
            // },
            closeObserver: {
                next: () => {
                    console.log('[WebSocketService]: connection closed');
                    this.connect(token, { reconnect: true });
                }
            },
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