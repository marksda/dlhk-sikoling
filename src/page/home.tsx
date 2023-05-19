import { IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { FormulirLogin } from "../components/FormulirLogin/FormulirLogin";
import { Header } from "./header";
import { ErrorPage } from "../error-page";

const containerStackTokens: IStackTokens = { childrenGap: 5};
const containerBodyStackTokens: IStackTokens = { childrenGap: 5};
const stackBodyStyles: IStackStyles = {
    root: {
      paddingLeft: 16,
      paddingRight: 16,
    },
};

export const Home = () => {
    const token = useAppSelector((state) => state.token);
    const navigate = useNavigate();

    // useEffect(
    //     () => {
    //         switch (token.hakAkses) {
    //             case 'Umum':
    //                 navigate("/pemrakarsa");
    //                 break;
    //             case 'Administrator':
    //                 navigate("/admin");
    //                 break;
    //             default:
    //                 break;
    //         }
    //     },
    //     [token]
    // );
        
    return (<>{
        token.hakAkses == null ? 
        <Stack tokens={containerStackTokens} >
            <Header />
            <Stack horizontal reversed tokens={containerBodyStackTokens} styles={stackBodyStyles}>
                <FormulirLogin />
            </Stack>             
        </Stack> : token.hakAkses == 'Administrator' ?
        navigate("/admin") : token.hakAkses == 'umum' ?
        navigate("/pemrakarsa") : <ErrorPage />
    }</>);
        
    
    
}