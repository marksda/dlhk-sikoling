import { DefaultEffects, IStackTokens, ITextFieldStyles, Label, Stack, TextField } from "@fluentui/react";
import React, { FormEvent, Props, useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IAlamat } from "../../features/alamat/alamat-slice";
import { DesaDropDown } from "../DesaDropDown/DesaDropDown";
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
import { KecamatanDropDown } from "../KecamatanDropDown/KecamatanDropDown";
import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";
import { setAlamat, setKeterangan } from "../../features/alamat/alamat-slice";


interface IPropsAlamat {
    title: string;
}

const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

export const AlamatGroup: React.FunctionComponent<IPropsAlamat> = ({title}) => {    
    const dispatch = useAppDispatch();
    const desa = useAppSelector(state => state.desa);
    const kecamatan = useAppSelector(state => state.kecamatan);
    const kabupaten = useAppSelector(state => state.kabupaten);
    const propinsi = useAppSelector(state => state.propinsi);
    const [detailValue, setDetailValue] = useState('');   

    dispatch(
        setAlamat({
            propinsi: propinsi,
            kabupaten: kabupaten,
            kecamatan: kecamatan,
            desa: desa,
            keterangan: ''
        }));    

    const onChangeDetailValue = useCallback(
        (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newDetailValue?: string) => {
            setDetailValue(newDetailValue||'');     
            dispatch(setKeterangan(newDetailValue||''));
        },
        []
    );
    
    return (      
        <>
            <Label style={{borderBottom: '2px solid #E81123', marginBottom: 8}}>
                {title}
            </Label>  
            <div style={{marginLeft: 8}}>
                <Stack tokens={stackTokens}>            
                    <PropinsiDropDown />
                    <KabupatenDropDown />
                    <KecamatanDropDown />
                    <DesaDropDown /> 
                    <TextField 
                        label="Detail"
                        placeholder="Isi detail alamat seperti nama jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                        value={detailValue}
                        onChange={onChangeDetailValue}
                        styles={textFieldStyles}
                        required multiline autoAdjustHeight
                    />  
                </Stack>
            </div>
        </>
    );
}
