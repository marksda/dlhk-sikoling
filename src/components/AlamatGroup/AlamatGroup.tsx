import { IDropdownStyles, IStackTokens, ITextFieldStyles, Label, Stack } from "@fluentui/react";
import { FC, useState } from "react";
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
import { useGetDesaByKecamatanQuery } from "../../features/desa/desa-api-slice";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";


interface IAlamatPropsComponent {
    title: string;
    control?: Control<any>;
    dropdownStyles: Partial<IDropdownStyles>;
    setValue?: any;
    name?: string;
};
const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

export const AlamatGroup: FC<IAlamatPropsComponent> = (props) => {    
    
    const [propinsi, setPropinsi] = useState<IPropinsi>(defaultPropinsi); 
    const { data: dataPropinsi = [], isFetching: isFetchingDataPropinsi } = useGetAllPropinsiQuery();
    const dataPropinsiOptions = dataPropinsi.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [kabupaten, setKabupaten] = useState<IKabupaten>(defaultKabupaten);
    const { data: dataKabupaten = [], isFetching: isFetchingDataKabupaten } = useGetKabupatenByPropinsiQuery(propinsi.id!);
    const dataKabupatenOptions = dataKabupaten.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [kecamatan, setKecamatan] = useState<IKecamatan>(defaultKecamatan);
    const { data: dataKecamatan = [], isFetching: isFetchingDataKecamatan } = useGetKecamatanByKabupatenQuery(kabupaten.id!);
    const dataKecamatanOptions = dataKecamatan.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [desa, setDesa] = useState<IDesa>(defaultDesa);
    const { data: dataDesa = [], isFetching: isFetchingDataDesa } = useGetDesaByKecamatanQuery(kecamatan.id!);
    const dataDesaOptions = dataDesa.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const resetPropinsi = (item: IPropinsi) => {          
        setDesa({id: '', nama: ''});
        setKecamatan({id: '', nama: ''});
        setKabupaten({id: '', nama: ''});
        setPropinsi(item);
        props.setValue("alamat.kabupaten", null);
        props.setValue("alamat.kecamatan", null);
        props.setValue("alamat.desa", null);
    }

    const resetKabupaten = (item: IKabupaten) => {               
        setKabupaten(item); 
        setKecamatan({id: '', nama: ''});
        props.setValue("alamat.kecamatan", null);
        props.setValue("alamat.desa", null)
    }

    const resetKecamatan = (item: IKabupaten) => {               
        setKecamatan(item); 
        setDesa({id: '', nama: ''});
        props.setValue("alamat.desa", null);
    }
    
    return (      
        <>
            <Label style={{borderBottom: '2px solid grey', marginBottom: 8}}>
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
                        name={`${props.name}.propinsi`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}       
                        defaultItemSelected={defaultPropinsi}             
                    />       
                    <ControlledFluentUiDropDown
                        label="Kabupaten / Kota"
                        placeholder="Pilih Kabupaten sesuai dengan ktp"
                        isFetching={isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKabupatenOptions}
                        control={props.control}
                        onChangeItem={resetKabupaten}
                        required={true}
                        name={`${props.name}.kabupaten`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}  
                        defaultItemSelected={defaultKabupaten}                  
                    />
                    <ControlledFluentUiDropDown
                        label="Kecamatan"
                        placeholder="Pilih Kecamatan sesuai dengan ktp"
                        isFetching={isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataKecamatanOptions}
                        control={props.control}
                        onChangeItem={resetKecamatan}
                        required={true}
                        name={`${props.name}.kecamatan`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}    
                        defaultItemSelected={defaultKecamatan}                
                    />  
                    <ControlledFluentUiDropDown
                        label="Desa"
                        placeholder="Pilih Desa sesuai dengan ktp"
                        isFetching={isFetchingDataDesa||isFetchingDataKecamatan||isFetchingDataKabupaten||isFetchingDataPropinsi}
                        options={dataDesaOptions}
                        control={props.control}
                        onChangeItem={resetDesa}
                        required={true}
                        name={`${props.name}.desa`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}  
                        defaultItemSelected={defaultDesa}                  
                    />
                    <ControlledFluentUiTextField
                        label="Detail Alamat"
                        placeholder="Isi detail alamat seperti nama jalan, perumahan, blok, nomor rumah, rt,rw, gedung, lantai atau yang lainnya"
                        control={props.control}
                        name={`${props.name}.keterangan`}
                        rules={{ required: "harus diisi sesuai dengan ktp" }}                    
                        styles={textFieldStyles}    
                        required multiline autoAdjustHeight
                    /> 
                </Stack>
            </div>
        </>
    );
}
