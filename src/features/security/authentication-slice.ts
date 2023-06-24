import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICredential } from "../entity/credential";

const initialState: ICredential = {
    userName: '',
    password: '',
};

export const authenticationSlice = createSlice({
    name: 'credential',
    initialState,
    reducers: {
        setCredential: (state, action: PayloadAction<ICredential>) => {
            state.userName = action.payload.userName;
            state.password = action.payload.password;
        },
        setUserNameCredential: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setPasswordCredential: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        resetCredential: (state, action: PayloadAction<void>) => {
            state.userName = '';
            state.password = '';
        },
    },
}); 

export const { setCredential, setUserNameCredential, setPasswordCredential, resetCredential } = authenticationSlice.actions;
export default authenticationSlice.reducer;