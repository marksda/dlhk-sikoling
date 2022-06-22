import { IStackTokens, Stack } from "@fluentui/react";
import React from "react"
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
// import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";


const stackTokens: IStackTokens = { childrenGap: 20 };

export const FormulirPerson: React.FunctionComponent = () => {
    return (
        <Stack tokens={stackTokens}>
            <KabupatenDropDown />
        </Stack>
    );
}
