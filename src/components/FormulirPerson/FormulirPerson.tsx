import { DefaultEffects, IStackTokens, Stack } from "@fluentui/react";
import React from "react"
import { DesaDropDown } from "../DesaDropDown/DesaDropDown";
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
import { KecamatanDropDown } from "../KecamatanDropDown/KecamatanDropDown";
import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";


const stackTokens: IStackTokens = { childrenGap: 8 };

export const FormulirPerson: React.FunctionComponent = () => {
    return (
        <div style={{
            display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid orange', borderRadius: 3, padding: 16, margin: 16}}>
            <Stack tokens={stackTokens}>
                <PropinsiDropDown />
                <KabupatenDropDown />
                <KecamatanDropDown />
                <DesaDropDown />
            </Stack>
        </div>
    );
}
