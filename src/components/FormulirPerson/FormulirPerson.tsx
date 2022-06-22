import { IStackTokens, Stack } from "@fluentui/react";
import React from "react"
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
import { KecamatanDropDown } from "../KecamatanDropDown/KecamatanDropDown";
import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";


const stackTokens: IStackTokens = { childrenGap: 20 };

export const FormulirPerson: React.FunctionComponent = () => {
    return (
        <Stack tokens={stackTokens}>
            <PropinsiDropDown />
            <KabupatenDropDown />
            <KecamatanDropDown />
        </Stack>
    );
}
