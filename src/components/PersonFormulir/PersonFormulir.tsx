import { FC } from "react"
import { DefaultEffects, IDropdownStyles, IStackTokens, ITextFieldStyles, PrimaryButton, Stack } from "@fluentui/react"
import { AlamatGroup } from "../AlamatGroup/AlamatGroup"
import { useForm } from "react-hook-form"
import { IPerson } from "../../features/person/person-slice"
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField"
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown"
import { useGetAllJenisKelaminQuery } from "../../features/jenis-kelamin/jenis-kelamin-api-slice"
import { defaultDesa, defaultJenisKelamin, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config"
import { IContainerUploadStyle, UploadFilesFluentUi } from "../UploadFiles/UploadFilesFluentUI"
import { useAddPersonMutation } from "../../features/person/person-api-slice"


const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };
const containerStyle: IContainerUploadStyle = {
    width: 300, 
    height: 100, 
    backgroundColor: '#ECECEC',
};

export const PersonFormulir: FC = () => {   
    const [ addPerson ] = useAddPersonMutation();

    const { control, handleSubmit, setValue  } = useForm<IPerson>({
        mode: 'onSubmit',
        defaultValues: {
            nik: '',
            nama: '',
            jenisKelamin: defaultJenisKelamin,
            alamat: {
                propinsi: defaultPropinsi,
                kabupaten: defaultKabupaten,
                kecamatan: defaultKecamatan,
                desa: defaultDesa,
                keterangan: '',
            },
            kontak: {telepone: '', email: ''},
            scanKtp: '',
        }
    });

    const { data: dataJenisKelamin = [], isFetching } = useGetAllJenisKelaminQuery();  

    const dataJenisKelaminOptions = dataJenisKelamin.map((t) => { return {key: t.id as string, text: t.nama as string}; });

    const onButtonSimpanClick = () => { 
        handleSubmit(
            (data) => {
            //   console.log(data);
              addPerson(data);
            },
            (err) => {                
              console.log(err);
            }
          )();
    };

    return (
        <div style={{display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid #0078D7', borderRadius: 3, padding: 16, margin: 16}}>
            <Stack tokens={stackTokens}>  
                <UploadFilesFluentUi 
                    label='Upload File Hasil Scan KTP'
                    showPreview={false}
                    containerStyle={containerStyle}
                />
                <ControlledFluentUiTextField
                    required
                    label="NIK"
                    control={control}
                    name="nik"
                    rules={{ required: "harus diisi sesuai dengan ktp" }}                    
                    styles={textFieldStyles}    
                />
                <ControlledFluentUiTextField
                    required
                    label="Nama"
                    control={control}
                    name="nama"
                    rules={{ required: "harus diisi sesuai dengan ktp" }}                    
                    styles={textFieldStyles}    
                /> 
                <ControlledFluentUiDropDown
                    label="Jenis Kelamin"
                    placeholder="Pilih Jenis Kelamin"
                    options={dataJenisKelaminOptions}
                    control={control}
                    required
                    name="jenisKelamin"
                    rules={{ required: "harus diisi sesuai dengan ktp" }} 
                    styles={dropdownStyles}   
                    defaultItemSelected={defaultJenisKelamin}                 
                /> 
                <ControlledFluentUiTextField
                    required
                    label="Telepone"
                    control={control}
                    name="kontak.telepone"
                    rules={{ required: "minimal harus diisi satu nomor telepone yang aktif" }}                    
                    styles={textFieldStyles}    
                />     
                <ControlledFluentUiTextField
                    required
                    label="Email"
                    control={control}
                    name="kontak.email"
                    rules={{ required: "Alamat email harus diisi" }}                    
                    styles={textFieldStyles}    
                />
                <AlamatGroup 
                    title="Alamat"
                    control={control}
                    setValue={setValue}
                    dropdownStyles={dropdownStyles}
                />
                <PrimaryButton text="Simpan" onClick={onButtonSimpanClick} style={{marginTop: 16, width: 100}}/>
            </Stack>            
        </div>
    );
}