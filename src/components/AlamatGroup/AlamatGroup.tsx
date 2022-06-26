import { IDropdownStyles, IStackTokens, ITextFieldStyles, Label, Stack, TextField } from "@fluentui/react";
import { FC, FormEvent, useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { DesaDropDown } from "../DesaDropDown/DesaDropDown";
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
import { KecamatanDropDown } from "../KecamatanDropDown/KecamatanDropDown";
import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";
import { IAlamat, setAlamat, setKeterangan } from "../../features/alamat/alamat-slice";
import { useGetAllPropinsiQuery } from "../../features/propinsi/propinsi-api-slice";
import { Control } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { IPropinsi } from "../../features/propinsi/propinsi-slice";
import { useGetKabupatenByPropinsiQuery } from "../../features/kabupaten/kabupaten-api-slice";
import { IKabupaten } from "../../features/kabupaten/kabupaten-slice";


interface IAlamatPropsComponent {
    title: string;
    control: Control<any>;
    dropdownStyles: Partial<IDropdownStyles>;
}

const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

export const AlamatGroup: FC<IAlamatPropsComponent> = (props) => {      
    const alamat: IAlamat = {
        propinsi: defaultPropinsi,
        kabupaten: defaultKabupaten,
        kecamatan: defaultKecamatan,
        desa: defaultDesa,
        keterangan: '',
    } 
    const [propinsi, setPropinsi] = useState<IPropinsi>(defaultPropinsi); 
    const { data: dataPropinsi = [], isFetching: isFetchingDataPropinsi } = useGetAllPropinsiQuery();
    const dataPropinsiOptions = dataPropinsi.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const [kabupaten, setKabupaten] = useState<IKabupaten|null>(defaultKabupaten);
    const { data: dataKabupaten = [], isFetching: isFetchingDataKabupaten } = useGetKabupatenByPropinsiQuery(propinsi.id);
    const dataKabupatenOptions = dataKabupaten.map((t) => {
        return {key: t.id as string, text: t.nama as string}; 
    });

    const resetPropinsi = (item: IPropinsi) => {        
        setKabupaten(null);
        setPropinsi(item);
    }

    const dispatch = useAppDispatch();
    const desa = useAppSelector(state => state.desa);
    const kecamatan = useAppSelector(state => state.kecamatan);
    // const kabupaten = useAppSelector(state => state.kabupaten);
    // const propinsi = useAppSelector(state => state.propinsi);
    const [detailValue, setDetailValue] = useState('');   

    // dispatch(
    //     setAlamat({
    //         // propinsi: propinsi,
    //         kabupaten: kabupaten,
    //         kecamatan: kecamatan,
    //         desa: desa,
    //         keterangan: ''
    //     }));    

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
                    <PropinsiDropDown
                        label="Propinsi"
                        placeholder="Pilih Propinsi sesuai dengan ktp"
                        propinsi={propinsi}
                        setPropinsi={resetPropinsi}
                        options={dataPropinsiOptions}
                        control={props.control}
                        required={true}
                        name={"alamat"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}
                        nilaiDefault={undefined}
                        isFetching={isFetchingDataPropinsi}
                    /> 
                    <KabupatenDropDown 
                        label="Kabupaten"
                        placeholder="Pilih Kabupaten sesuai dengan ktp"
                        kabupaten={kabupaten}
                        setKabupaten={setKabupaten}
                        options={dataKabupatenOptions}
                        control={props.control}
                        required={true}
                        name={"alamat"}
                        rules={{ required: "harus diisi sesuai dengan ktp" }} 
                        styles={props.dropdownStyles}
                        nilaiDefault={undefined}
                        isFetching={isFetchingDataKabupaten}
                    />
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
