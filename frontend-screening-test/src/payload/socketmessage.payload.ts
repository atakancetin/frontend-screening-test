export interface SocketMessage {
    MessageType: SocketMessageType;
    TimeStamp?: Date;
}
export enum SocketMessageType {
    Ping = 0,
    LogOff = 1
}