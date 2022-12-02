import { IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { FormulirLogin } from "../components/FormulirLogin/FormulirLogin";
import { setToken } from "../features/security/token-slice";
import { Header } from "./header";


const containerStackTokens: IStackTokens = { childrenGap: 5};
const containerBodyStackTokens: IStackTokens = { childrenGap: 5};
const stackBodyStyles: IStackStyles = {
    root: {
      paddingLeft: 16,
      paddingRight: 16,
    },
};

export const Home: FC = () => {
    const token = useAppSelector((state) => state.token);
    //react redux
    const dispatch = useAppDispatch();
    // //react router
    const navigate = useNavigate();

    useEffect(
        () => {
            if(token.hakAkses == null) {
                let tokenString = localStorage.getItem('token');
                if(tokenString != null){
                    dispatch(setToken(JSON.parse(tokenString)));
                }                
            }
            else {
                switch (token.hakAkses) {
                    case 'pemrakarsa':
                        navigate("/pemrakarsa");
                        break;   
                    case 'admin':
                        navigate("/admin");
                        break;                
                    default:
                        break;
                }
            }            
        },
        [token]
    );

    return (
        <Stack tokens={containerStackTokens} >
            <Header />
            <Stack horizontal reversed tokens={containerBodyStackTokens} styles={stackBodyStyles}>
                <FormulirLogin />
            </Stack>             
        </Stack>
    );
}