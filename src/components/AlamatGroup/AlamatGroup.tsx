import { IDropdownStyles, IStackTokens, ITextFieldStyles, Label, Stack, TextField } from "@fluentui/react";
import { FC, FormEvent, useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setKeterangan } from "../../features/alamat/alamat-slice";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { Control } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { IPropinsi } from "../../features/propinsi/propinsi-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { IKabupaten } from "../../features/kabupaten/kabupaten-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { IKecamatan } from "../../features/kecamatan/kecamatan-slice";
import { useGetKecamatanByKabupatenQuery } from "../../features/kecamatan/kecamatan-api-slice";
import { IDesa, resetDesa } from "../../features/desa/desa-slice";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUITextField";


interface IAlamatPropsComponent {
    title: string;
    control: Control<any>;
    dropdownStyles: Partial<IDropdownStyles>;
}
const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

export const AlamatGroup: FC<IAlamatPropsComponent> = (props) => {    
    
    const [propinsi, setPropinsi] = useState<IPropinsi>(defaultPropinsi); 
    const { data: dataPropinsi = [], isFetching: isFetchingDataPropinsi } = useGetAllPropinsiQuery();
    const dataPropinsiOptions = dataPropinsi.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [kabupaten, setKabupaten] = useState<IKabupaten>(defaultKabupaten);
    const { data: dataKabupaten = [], isFetching: isFetchingDataKabupaten } = useGetKabupatenByPropinsiQuery(propinsi.id);
    const dataKabupatenOptions = dataKabupaten.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [kecamatan, setKecamatan] = useState<IKecamatan>(defaultKecamatan);
    const { data: dataKecamatan = [], isFetching: isFetchingDataKecamatan } = useGetKecamatanByKabupatenQuery(kabupaten.id);
    const dataKecamatanOptions = dataKecamatan.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [desa, setDesa] = useState<IDesa>(defaultDesa);
    const { data: dataDesa = [], isFetching: isFetchingDataDesa } = useGetKecamatanByKabupatenQuery(kecamatan.id);
    const dataDesaOptions = dataDesa.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const resetPropinsi = (item: IPropinsi) => {          
        setDesa({id: '', nama: ''});
        setKecamatan({id: '', nama: ''});
        setKabupaten({id: '', nama: ''});
        setPropinsi(item);
    }

    const resetKabupaten = (item: IKabupaten) => {               
        setKabupaten(item); 
        setKecamatan({id: '', nama: ''});
    }

    const resetKecamatan = (item: IKabupaten) => {               
        setKecamatan(item); 
        setDesa({id: '', nama: ''});
    }



    const dispatch = useAppDispatch();
    const [detailValue, setDetailValue] = useState('');   

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
                {props.title}
            </Label>  
            <div style={{marginLeft: 8}}>
                <Stack tokens={stackTokens}>      
                    <ControlledFluentUiDropDown
                        label="Propinsi"
                        placeholder="Pilih Propinsi sesuai dengan ktp"
                        isFetching={isFetchingDataPropinsi}
                        options={dataPropinsiOptions}
                        control={props.control}
                        onChangeItem={resetPropinsi}
                        required={true}
                        name={"propensi"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}                    
                    />       
                    <ControlledFluentUiDropDown
                        label="Kabupaten"
                        placeholder="Pilih Kabupaten sesuai dengan ktp"
                        isFetching={isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKabupatenOptions}
                        control={props.control}
                        onChangeItem={resetKabupaten}
                        required={true}
                        name={"kabupaten"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}                    
                    />
                    <ControlledFluentUiDropDown
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan sesuai dengan ktp"
                        isFetching={isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKecamatanOptions}
                        control={props.control}
                        onChangeItem={resetKecamatan}
                        required={true}
                        name={"kecamatan"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}                    
                    />  
                    <ControlledFluentUiDropDown
                        label="Desa"
                        placeholder="Pilih Desa sesuai dengan ktp"
                        isFetching={isFetchingDataDesa||isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataDesaOptions}
                        control={props.control}
                        onChangeItem={resetDesa}
                        required={true}
                        name={"desa"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}                    
                    />
                    <ControlledFluentUiTextField
                        label="NIK"
                        placeholder="Isi detail alamat seperti nama jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                        control={props.control}
                        name="keterangan"
                        rules={{ required: "harus diisi sesuai dengan ktp" }}                    
                        styles={textFieldStyles}    
                        required multiline autoAdjustHeight
                    />  
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
