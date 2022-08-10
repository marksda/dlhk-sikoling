import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface IAuthorization {
    userId: string;
    userName: string;
}

const initialState: IAuthorization = {
    userId: '',
    userName: '',
}

//redux busines logic
export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setAuthorization: (state, action: PayloadAction<IAuthorization>) => {
            state.userId = action.payload.userId;
            state.userName = action.payload.userName;
        },
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload;
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
    },
}); 

// redux action creator
export const { setAuthorization, setUserId, setUserName } = authorizationSlice.actions;

export default authorizationSlice.reducer;