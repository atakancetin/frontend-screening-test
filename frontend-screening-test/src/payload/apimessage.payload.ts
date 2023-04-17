export interface LoginRequest {
    email: string;
    password: string;
}
export interface ApiResult<T = string> {
    data: T;
    apiStatus: Status;
    error: string;
}
export interface LoginResponse extends ApiResult<{ userGroup: number, token: string }> {
}
export enum Status {
    Ok,
    Error
}