import { IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";
import { FormulirLogin } from "../components/FormulirLogin/FormulirLogin";
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
    const today = new Date().toLocaleDateString();
    return (
        <Stack tokens={containerStackTokens} >
            <Header />
            <Stack horizontal reversed tokens={containerBodyStackTokens} styles={stackBodyStyles}>
                <FormulirLogin />
            </Stack>             
        </Stack>
    );
}