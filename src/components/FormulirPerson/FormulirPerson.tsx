import { DefaultEffects, IStackTokens, Stack } from "@fluentui/react";
import React from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IAlamat } from "../../features/alamat/alamat-slice";
import { DesaDropDown } from "../DesaDropDown/DesaDropDown";
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
import { KecamatanDropDown } from "../KecamatanDropDown/KecamatanDropDown";
import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";
import { setAlamat } from "../../features/alamat/alamat-slice";
import { IJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice";
import { IPerson } from "../../features/person/person-slice";


const stackTokens: IStackTokens = { childrenGap: 8 };

export const FormulirPerson: React.FunctionComponent = () => {    
    const dispatch = useAppDispatch();
    const desa = useAppSelector(state => state.desa);
    const kecamatan = useAppSelector(state => state.kecamatan);
    const kabupaten = useAppSelector(state => state.kabupaten);
    const propinsi = useAppSelector(state => state.propinsi);
    const alamat: IAlamat = {
        propinsi: propinsi,
        kabupaten: kabupaten,
        kecamatan: kecamatan,
        desa: desa,
        keterangan: ''
    };

    dispatch(setAlamat(alamat));
    
    return (
        <div style={{
            display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid orange', borderRadius: 3, padding: 16, margin: 16}}>
            <Stack tokens={stackTokens}>
                <PropinsiDropDown />
                <KabupatenDropDown />
                <KecamatanDropDown />
                <DesaDropDown /> 
            </Stack>
        </div>
    );
}
