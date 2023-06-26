import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRegisterKbli } from "../../entity/register-kbli";
import { IDokumenNibOss } from "../../entity/dokumen-nib-oss";
import { IKbli } from "../../entity/kbli";
import cloneDeep from "lodash.clonedeep";

const initialState: IRegisterKbli = {
    dokumenNibOss: null,
    kbli: null
};

export const registerKbliSlice = createSlice({
    name: 'registerKbli',
    initialState,
    reducers: {
        setRegisterKbli: (state, action: PayloadAction<IRegisterKbli>) => {
            state.dokumenNibOss = cloneDeep(action.payload.dokumenNibOss);
            state.kbli = cloneDeep(action.payload.kbli);
        },
        setDokumenNibOss: (state, action: PayloadAction<IDokumenNibOss>) => {
            state.dokumenNibOss = cloneDeep(action.payload);
        },
        setKbli: (state, action: PayloadAction<IKbli>) => {
            state.kbli = cloneDeep(action.payload);
        }
    }
});

export const { setRegisterKbli, setDokumenNibOss, setKbli} = registerKbliSlice.actions;
export default registerKbliSlice.reducer;