import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface IAuthentication {
    userName: string;
    password: string;
};

const initialState: IAuthentication = {
    userName: '',
    password: '',
};

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setAuthentication: (state, action: PayloadAction<IAuthentication>) => {
            state.userName = action.payload.userName;
            state.password = action.payload.password;
        },
        setUserNameAuthentication: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setPasswordAuthentication: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
    },
}); 

export const { setAuthentication, setUserNameAuthentication, setPasswordAuthentication } = authenticationSlice.actions;
export default authenticationSlice.reducer;