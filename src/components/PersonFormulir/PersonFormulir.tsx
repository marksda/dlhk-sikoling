import { DefaultEffects, IStackTokens, Stack, TextField } from "@fluentui/react";
import React from "react"
import { AlamatGroup } from "../AlamatGroup/AlamatGroup";


const stackTokens: IStackTokens = { childrenGap: 8 };

export const PersonFormulir: React.FunctionComponent = () => {
    return (
        <div style={{
            display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid orange', borderRadius: 3, padding: 16, margin: 16}}>
            <Stack tokens={stackTokens}>
                <TextField 
                    label="NIK"
                    placeholder="Isi sesuai dengan ktp"
                />       
                <TextField 
                    label="Nama"
                    placeholder="Isi sesuai dengan ktp"
                />         
                <AlamatGroup title="Alamat"/>
            </Stack>            
        </div>
    );
}