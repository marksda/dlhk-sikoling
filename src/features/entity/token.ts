export interface IToken {
    userId: string|null;
    userName: string|null;
    userEmail: string|null;    
    hakAkses: string|null,
    accessToken: string|null;
    refreshToken: string|null;
    expireIn: string|null;
    sessionId: string|null;
};