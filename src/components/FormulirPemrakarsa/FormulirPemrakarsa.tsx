import { IDropdownStyles, IStackTokens, ITextFieldStyles, Label, PrimaryButton, Stack } from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { IModelPerizinan, useGetAllModelPerizinanQuery } from "../../features/perusahaan/model-perizinan-api-slice";
import { IKategoriPelakuUsaha, IPelakuUsaha, useGetAllKategoriPelakuUsahaQuery, useGetPelakuUsahaByKategoriPelakuUsahaQuery } from "../../features/perusahaan/pelaku-usaha-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { AktaGroup } from "../AktaGroup/AktaGroup";
import { AlamatGroup } from "../AlamatGroup/AlamatGroup";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";


const stackTokens: IStackTokens = {childrenGap: 8};
const textFieldStyles: Partial<ITextFieldStyles> = {fieldGroup: {width: 300}};
const dropdownStyles: Partial<IDropdownStyles> = {dropdown: {width: 300}};

export const FormulirPemrakarsa: FC = () => {

    const [kategoriPelakuUsaha, setKategoriPelakuUsaha] = useState<IKategoriPelakuUsaha|undefined>(undefined);
    // const [pelakuUsaha, setPelakuUsaha] = useState<IPelakuUsaha|undefined>(undefined);

    const { control, handleSubmit, setValue } = useForm<IPerusahaan>({
        mode: 'onSubmit',
        defaultValues: {
            id: null,
            modelPerizinan: null,
            skalaUsaha: null,
            pelakuUsaha: null,
            alamat: {
                propinsi: defaultPropinsi,
                kabupaten: defaultKabupaten,
                kecamatan: defaultKecamatan,
                desa: defaultDesa,
                keterangan: '',
            },
            kontak: {
                telepone: null,
                fax: null,
                email: null,
            },
        }
    });

    const { data: dataModelPerizinan = [], isFetching: isFetchingModelPerizinan} = useGetAllModelPerizinanQuery();
    const dataModelPerizinanOptions = dataModelPerizinan.map((t) => { return {key: t.id as string, text: t.nama as string}; });

    const { data: dataKategoriPelakuUsaha = [], isFetching: isFetchingKategoriPelakuUsaha} = useGetAllKategoriPelakuUsahaQuery();
    const dataKategoriPelakuUsahaOptions = dataKategoriPelakuUsaha.map((t) => { return {key: t.id as string, text: t.nama as string}; });

    const { data: dataPelakuUsaha = [], isFetching: isFetchingPelakuUsaha} = useGetPelakuUsahaByKategoriPelakuUsahaQuery(
        kategoriPelakuUsaha?.id as string, { skip: kategoriPelakuUsaha === undefined ? true: false});        
    const dataPelakuUsahaOptions = dataPelakuUsaha.map((t) => { 
        return {key: t.id as string, text: `${t.nama} (${t.singkatan})`}; 
    });

    const handleOnChangeKategoriPelakuUsaha = useCallback(
        (item: IKategoriPelakuUsaha) => {
            setKategoriPelakuUsaha(item);
        },
        []
    );

    const handleOnChangePelakuUsaha = useCallback(
        (item: IPelakuUsaha) => {
            // setPelakuUsaha(item);
            setValue("pelakuUsaha", item);
        },
        []
    );

    const handleOnChangeModelPerizinan = useCallback(
        (item: IModelPerizinan) => {
            setValue("modelPerizinan", item);
        },
        []
    );
    
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

    return(
        <>
            <Label style={{borderBottom: '2px solid grey', marginBottom: 8}}>
                Data Pemrakarsa
            </Label> 
            <div style={{marginLeft: 8}}>
                <Stack tokens={stackTokens}>
                    <ControlledFluentUiDropDown
                        label="Verifikasi OSS"
                        placeholder="Pilih OSS atau NON OSS"
                        options={dataModelPerizinanOptions}
                        required
                        name="modelPerizinan"
                        styles={dropdownStyles}           
                        isFetching={isFetchingModelPerizinan}      
                        onChangeItem={handleOnChangeModelPerizinan}
                    /> 
                    <ControlledFluentUiDropDown
                        label="Kategori Pelaku Usaha"
                        placeholder="Pilih Kategori Pelaku Usaha"
                        options={dataKategoriPelakuUsahaOptions}
                        required
                        name="kategoriPelakuUsaha"
                        styles={dropdownStyles}           
                        isFetching={isFetchingKategoriPelakuUsaha}      
                        onChangeItem={handleOnChangeKategoriPelakuUsaha}
                    /> 
                    <ControlledFluentUiDropDown
                        label="Bentuk Usaha"
                        placeholder="Pilih Bentuk Usaha"
                        options={dataPelakuUsahaOptions}
                        required
                        name="bentukUsaha"
                        styles={dropdownStyles}           
                        isFetching={isFetchingPelakuUsaha}      
                        control={control}                     
                        rules={{ required: "harus diisi sesuai dengan akta perusahaan" }}  
                        onChangeItem={handleOnChangePelakuUsaha}
                    /> 
                    <ControlledFluentUiTextField
                        label="Nama"
                        name="nama"         
                        control={control}  
                        rules={{ required: "harus diisi sesuai dengan akta perusahaan" }}  
                        required
                        styles={textFieldStyles}    
                    />
                    <ControlledFluentUiTextField
                        label="NPWP"
                        name="npwp"         
                        control={control}  
                        rules={{ required: "harus diisi sesuai dengan npwp perusahaan" }}  
                        required
                        styles={textFieldStyles}    
                    />
                    <ControlledFluentUiTextField
                        label="Telepon"
                        name="kontakPemrakarsa.telepone"         
                        control={control}  
                        rules={{ required: "harus diisi sesuai dengan telepon perusahaan" }}  
                        required
                        styles={textFieldStyles}
                    />
                    <ControlledFluentUiTextField
                        label="Fax"
                        name="kontakPemrakarsa.fax"         
                        control={control}  
                        rules={{ required: "harus diisi sesuai dengan fax perusahaan" }}  
                        required
                        styles={textFieldStyles}
                    />
                    <ControlledFluentUiTextField
                        label="Email"
                        name="kontakPemrakarsa.email"         
                        control={control}  
                        rules={{ required: "harus diisi sesuai dengan email perusahaan" }}  
                        required
                        styles={textFieldStyles}
                    />
                    <AktaGroup
                        title="Akta Pendirian"
                        name="aktaPemrakarsa"
                        control={control}
                    />
                    <AlamatGroup 
                        title="Alamat"
                        name="alamat"
                        control={control}
                        setValue={setValue}
                        dropdownStyles={dropdownStyles}
                    />
                    <PrimaryButton text="Simpan" onClick={onButtonSimpanClick} style={{marginTop: 16, width: 100}}/>
                </Stack>
            </div>
        </>
    );
};