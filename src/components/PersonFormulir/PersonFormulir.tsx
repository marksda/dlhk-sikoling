import { DefaultEffects, IStackTokens, ITextFieldStyles, PrimaryButton, Stack, TextField } from "@fluentui/react"
import React, { FormEvent, useCallback, useState } from "react"
import { AlamatGroup } from "../AlamatGroup/AlamatGroup"
import { JenisKelaminDropDown } from "../JenisKelaminDropDown/JenisKelaminDropDown"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { IPerson } from "../../features/person/person-slice"
import { ControlledTextField } from "../ControlledTextField/ControlledTextField"


const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

export const PersonFormulir: React.FunctionComponent = () => {
    const { control, handleSubmit } = useForm<IPerson>();

    const onButtonSimpanClick = () => { 
        handleSubmit(
            (data) => {
              console.log(data);
            },
            (err) => {                
              console.log(err);
            }
          )();
    };

    return (
        <div style={{
            display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid #0078D7', borderRadius: 3, padding: 16, margin: 16}}>
            <Stack tokens={stackTokens}>  
                <ControlledTextField
                    required={true}
                    label="NIK"
                    control={control}
                    name={"nik"}
                    rules={{ required: "harus diisi sesuai dengan ktp" }}                    
                    styles={textFieldStyles}    
                />
                <ControlledTextField
                    required={true}
                    label="Nama"
                    control={control}
                    name={"nama"}
                    rules={{ required: "harus diisi sesuai dengan ktp" }}                    
                    styles={textFieldStyles}    
                /> 
                <JenisKelaminDropDown />   
                <ControlledTextField
                    required={true}
                    label="Telepone"
                    control={control}
                    name={"telepone"}
                    rules={{ required: "minimal harus diisi satu nomor telepone yang aktif" }}                    
                    styles={textFieldStyles}    
                />     
                <AlamatGroup title="Alamat"/>
                <PrimaryButton text="Simpan" onClick={onButtonSimpanClick} style={{marginTop: 16, width: 100}}/>
            </Stack>            
        </div>
    );
}