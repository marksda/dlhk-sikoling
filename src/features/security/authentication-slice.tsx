import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthentication {
    userName: string;
    password: string;
};

const initialState: IAuthentication = {
    userName: '',
    password: '',
};

export const authorizationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        setAuthentication: (state, action: PayloadAction<IAuthentication>) => {
            state.userName = action.payload.userName;
            state.password = action.payload.password;
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
    },
}); 

export const { setAuthentication, setUserName, setPassword } = authorizationSlice.actions;
export default authorizationSlice.reducer;