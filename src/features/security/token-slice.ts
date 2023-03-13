import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface IToken {
    userId: string|null;
    userName: string|null;
    userEmail: string|null;    
    hakAkses: string|null,
    accessToken: string|null;
    refreshToken: string|null;
    expireOn: string|null;
};

export interface IResponseStatusToken {
    status: string;
    token: IToken;
};

const initialState: IToken = localStorage.getItem('token') != null ?
JSON.parse(localStorage.getItem('token') as string) :
{
    userId: null,
    userName: null,
    userEmail: null,    
    hakAkses: null,
    accessToken: null,
    refreshToken: null,
    expireOn: null,
};

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
            state.hakAkses = action.payload.hakAkses;
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
        resetToken: (state, action: PayloadAction<void>) => {
            state.userId = null;
            state.userName = null;
            state.userEmail = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.expireOn = null;
            state.hakAkses = null;
        },
    },
});

export const { setToken, setUserId, setUserNama, setUserEmail, setAccessToken, setRefreshToken, resetToken } = tokenSlice.actions;

export default tokenSlice.reducer;