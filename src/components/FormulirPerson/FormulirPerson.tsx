import { DefaultEffects } from "@fluentui/react";
import React from "react"
import { AlamatGroup } from "../AlamatGroup/AlamatGroup";


// const stackTokens: IStackTokens = { childrenGap: 24 };

export const FormulirPerson: React.FunctionComponent = () => {
    return (
        <>
            <div style={{
                display: "inline-block", boxShadow: DefaultEffects.elevation8, 
                borderTop: '2px solid orange', borderRadius: 3, padding: 16, margin: 16}}>
                <AlamatGroup title="Pemrakarsa"/>
            </div>
            <div style={{
                display: "inline-block", boxShadow: DefaultEffects.elevation8, 
                borderTop: '2px solid orange', borderRadius: 3, padding: 16, margin: 16}}>
                <AlamatGroup title="Penanggung Jawab"/>
            </div>
        </>
    );
}
