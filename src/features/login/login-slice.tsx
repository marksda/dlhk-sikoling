import { createSlice } from "@reduxjs/toolkit"
import CryptoJS from 'crypto-js';

interface loginState {
    user_profile: any,
    credential_profile: any,
    header_authorization: any
}

const loadLocalCredentialStorage = () => {
    let tmpData = window.localStorage.getItem('{$2a$04$uNYaQhd6v9Em48tVM/duVOYI6L1AdCMdPNvKdMJ0/mQxnmsRIN0G2}')
    if(tmpData !== null){
        let bytes  = CryptoJS.AES.decrypt(tmpData.toString(), 'e4ac72eb583f85965fbaa52641546107')
        let pengaturan = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return pengaturan
    }
    else {
        return null
    }
}

const loadLocalProfileStorage = () => {
    let tmpData = window.localStorage.getItem('{$2a$04$LEBKjg.jyXK7IJzEBHBe/erI/fRXwEiLdoWTB0Lva64GGCFXn51aG}')
    if(tmpData !== null){
        let bytes  = CryptoJS.AES.decrypt(tmpData.toString(), '79cec0fc8a27bb1d1e99e5661e42f842')
        let pengaturan = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return pengaturan
    }
    else {
        return null
    }
}

const cr = loadLocalCredentialStorage();
const pfl = loadLocalProfileStorage();

const initialState: loginState = {
    user_profile:  cr,
    credential_profile: pfl,
    header_authorization: cr!=null?{Authorization: `Bearer ${cr.token}`}:'invalid'
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        user: (state, action) => {
            state.user_profile = action.payload
        },
        credential: (state, action) => {
            state.credential_profile = action.payload
        },
        header: (state, action) => {
            state.header_authorization = action.payload
        }
    }
})

export const { user, credential, header } = loginSlice.actions
export default loginSlice.reducer
