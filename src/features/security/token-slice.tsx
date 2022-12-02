import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface IToken {
    userId: string|null;
    userName: string|null;
    userEmail: string|null;    
    hakAkses: string|null,
    accessToken: string|null;
    refreshToken: string|null;
    expireOn: string|null;
}

export interface IResponseStatusToken {
    status: string;
    token: IToken;
}

const initialState: IToken = {
    userId: null,
    userName: null,
    userEmail: null,    
    hakAkses: null,
    accessToken: null,
    refreshToken: null,
    expireOn: null,
}

export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<IToken>) => {
            state.userId = action.payload.userId;
            state.userName = action.payload.userName;
            state.userEmail = action.payload.userEmail;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.expireOn = action.payload.expireOn;
        },
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload;
        },
        setUserNama: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setUserEmail: (state, action: PayloadAction<string>) => {
            state.userEmail = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
    },
});

export const { setToken, setUserId, setUserNama, setUserEmail, setAccessToken, setRefreshToken } = tokenSlice.actions;

export default tokenSlice.reducer;