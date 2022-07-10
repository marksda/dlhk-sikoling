import { IDropdownStyles, IStackTokens, ITextFieldStyles, Label, Stack } from "@fluentui/react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetBentukUsahaByPelakuUsahaQuery } from "../../features/bentuk-usaha/bentuk-usaha-api-slice";
import { useGetAllJenisPelakuUsahaQuery } from "../../features/bentuk-usaha/jenis-pelaku-usaha-api-slice";
import { IJenisPelakuUsaha } from "../../features/bentuk-usaha/jenis-pelaku-usaha-slice";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { IPemrakarsa } from "../../features/pemrakarsa/pemrakarsa-slice";
import { AlamatGroup } from "../AlamatGroup/AlamatGroup";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";


const stackTokens: IStackTokens = {childrenGap: 8};
const textFieldStyles: Partial<ITextFieldStyles> = {fieldGroup: {width: 300}};
const dropdownStyles: Partial<IDropdownStyles> = {dropdown: {width: 300}};

export const FormulirPemrakarsa: FC = () => {

    const [jenisPelakuUsaha, setJenisPelakuUsaha] = useState<IJenisPelakuUsaha|undefined>(undefined);

    const { control, handleSubmit, setValue } = useForm<IPemrakarsa>({
        mode: 'onSubmit',
        defaultValues: {
            id: null,
            bentukUsaha: {
                id: '',
                nama: '',
                singkatan: '',
            },
            aktaPemrakarsa: {
                nomor: null,
                tanggal: null,
                namaNotaris: null,
            },
            alamat: {
                propinsi: defaultPropinsi,
                kabupaten: defaultKabupaten,
                kecamatan: defaultKecamatan,
                desa: defaultDesa,
                keterangan: '',
            },
            kontakPemrakarsa: {
                telepone: null,
                fax: null,
                email: null,
            },
            oss: {
                nib: null,
                tanggal: null,
                kbli: []
            },
            nama: null,
            npwp: null,
            penanggungJawab: {
                id: null,
                person: null,
                jabatan: null,
            },
            idCreator: '00001'
        }
    });

    const { data: dataJenisPelakuUsaha = [], isFetching: isFetchingJenisPelakuUsaha} = useGetAllJenisPelakuUsahaQuery();
    const dataJenisPelakuUsahaOptions = dataJenisPelakuUsaha.map((t) => { return {key: t.id as string, text: t.nama as string}; });

    const { data: dataBentukUsaha = [], isFetching: isFetchingBentukUsaha} = useGetBentukUsahaByPelakuUsahaQuery(
        jenisPelakuUsaha?.id as string
        );
    const dataBentukUsahaOptions = dataBentukUsaha.map((t) => { 
        return {key: t.id as string, text: `${t.nama} (${t.singkatan})`}; 
    });

    const loadBadanUsaha = (item: IJenisPelakuUsaha) => {
        setJenisPelakuUsaha(item);
    };

    return(
        <>
            <Label style={{borderBottom: '2px solid grey', marginBottom: 8}}>
                Data Pemrakarsa
            </Label> 
            <div style={{marginLeft: 8}}>
                <Stack tokens={stackTokens}>
                    <ControlledFluentUiDropDown
                        label="Jenis Pelaku Usaha"
                        placeholder="Pilih Jenis Pelaku Usaha"
                        options={dataJenisPelakuUsahaOptions}
                        required
                        name="jenisPelakuUsaha"
                        styles={dropdownStyles}           
                        isFetching={isFetchingJenisPelakuUsaha}      
                        onChangeItem={loadBadanUsaha}
                    /> 
                    <ControlledFluentUiDropDown
                        label="Bentuk Usaha"
                        placeholder="Pilih Bentuk Usaha"
                        options={dataBentukUsahaOptions}
                        required
                        name="bentukUsaha"
                        styles={dropdownStyles}           
                        isFetching={isFetchingBentukUsaha}   
                    /> 
                    <ControlledFluentUiTextField
                        required
                        label="Nama"
                        name="nama"         
                        control={control}  
                        rules={{ required: "harus diisi sesuai dengan akta perusahaan" }}  
                        styles={textFieldStyles}    
                    />
                    <AlamatGroup 
                        title="Alamat"
                        control={control}
                        setValue={setValue}
                        dropdownStyles={dropdownStyles}
                    />
                </Stack>
            </div>
        </>
    );
};