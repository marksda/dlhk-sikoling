import { DefaultEffects, IStackTokens, Stack } from "@fluentui/react";
import React from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IAlamat } from "../../features/alamat/alamat-slice";
import { DesaDropDown } from "../DesaDropDown/DesaDropDown";
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
import { KecamatanDropDown } from "../KecamatanDropDown/KecamatanDropDown";
import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";
import { setAlamat } from "../../features/alamat/alamat-slice";


const stackTokens: IStackTokens = { childrenGap: 8 };

export const AlamatGroup: React.FunctionComponent = () => {    
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
        <Stack tokens={stackTokens}>            
            <PropinsiDropDown />
            <KabupatenDropDown />
            <KecamatanDropDown />
            <DesaDropDown /> 
        </Stack>
    );
}
