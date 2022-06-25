import { DefaultEffects, IStackTokens, ITextFieldStyles, PrimaryButton, Stack, TextField } from "@fluentui/react"
import React, { FormEvent, useCallback, useState } from "react"
import { AlamatGroup } from "../AlamatGroup/AlamatGroup"
import { JenisKelaminDropDown } from "../JenisKelaminDropDown/JenisKelaminDropDown"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { IPerson } from "../../features/person/person-slice"


const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

export const PersonFormulir: React.FunctionComponent = () => {
    const { control, handleSubmit } = useForm<IPerson>();

    const onSubmit: SubmitHandler<IPerson> = data => {
        console.log(data);
    };

    const [nikValue, setNikValue] = useState('');
    const [namaValue, setNamaValue] = useState('');
    const [tlpValue, setTlpValue] = useState('');

    const onChangeNikValue = useCallback(
        (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newNikValue?: string) => {
            setNikValue(newNikValue||'');
        },
        []
    );

    const onChangeNamaValue = useCallback(
        (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newNamaValue?: string) => {
            setNamaValue(newNamaValue||'');
        },
        []
    );

    const onChangeTlpValue = useCallback(
        (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newTlpValue?: string) => {
            setTlpValue(newTlpValue||'');
        },
        []
    );

    const onButtonSimpanClick = () => { alert('simpan')}

    return (
        <div style={{
            display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid #0078D7', borderRadius: 3, padding: 16, margin: 16}}>
            <Stack tokens={stackTokens}>                
                <TextField 
                    label="NIK"
                    placeholder="Isi sesuai dengan ktp"
                    value={nikValue}
                    onChange={onChangeNikValue}
                    styles={textFieldStyles}
                    required
                />       
                <TextField 
                    label="Nama"
                    placeholder="Isi sesuai dengan ktp"
                    value={namaValue}
                    onChange={onChangeNamaValue}
                    styles={textFieldStyles}
                    required
                /> 
                <JenisKelaminDropDown />   
                <TextField 
                    label="Telepone"
                    placeholder="Isi dengan nomer Hp / rumah yang aktif"
                    value={tlpValue}
                    onChange={onChangeTlpValue}
                    styles={textFieldStyles}
                    required
                />      
                <AlamatGroup title="Alamat"/>
                <PrimaryButton text="Simpan" onClick={onButtonSimpanClick} style={{marginTop: 16, width: 100}}/>
            </Stack>            
        </div>
    );
}