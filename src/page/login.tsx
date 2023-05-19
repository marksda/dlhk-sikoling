import { IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";
import { Header } from "./header";
import { FormulirLogin } from "../components/FormulirLogin/FormulirLogin";

const containerStackTokens: IStackTokens = { childrenGap: 5};
const containerBodyStackTokens: IStackTokens = { childrenGap: 5};
const stackBodyStyles: IStackStyles = {
    root: {
      paddingLeft: 16,
      paddingRight: 16,
    },
};

export const LoginPage: FC = () => {
    return (
        <Stack tokens={containerStackTokens} >
            <Header />
            <Stack horizontal reversed tokens={containerBodyStackTokens} styles={stackBodyStyles}>
                <FormulirLogin />
            </Stack>             
        </Stack>
    );
};