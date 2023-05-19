import { IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC, useEffect } from "react";
import { Header } from "./header";
import { FormulirLogin } from "../components/FormulirLogin/FormulirLogin";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

const containerStackTokens: IStackTokens = { childrenGap: 5};
const containerBodyStackTokens: IStackTokens = { childrenGap: 5};
const stackBodyStyles: IStackStyles = {
    root: {
      paddingLeft: 16,
      paddingRight: 16,
    },
};

export const LoginPage: FC = () => {
    const token = useAppSelector((state) => state.token);
    const navigate = useNavigate();
    
    useEffect(
        () => {
            switch (token.hakAkses) {
                case 'Administrator':
                    navigate("/admin");
                    break;
                case 'Umum':
                    navigate("/pemrakarsa");
                    break;
                default:
                    break;
            }
        },
        [token]
    );
    
    return (
        <>
        {
            token.hakAkses == null ? 
                <Stack tokens={containerStackTokens}>
                    <Header />
                    <Stack horizontal reversed tokens={containerBodyStackTokens} styles={stackBodyStyles}>
                        <FormulirLogin />
                    </Stack>             
                </Stack> : null
        }
        </>
    );
};