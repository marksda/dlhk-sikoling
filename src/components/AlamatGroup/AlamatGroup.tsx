import { DefaultEffects, IStackTokens, Label, Stack } from "@fluentui/react";
import React, { Props } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IAlamat } from "../../features/alamat/alamat-slice";
import { DesaDropDown } from "../DesaDropDown/DesaDropDown";
import { KabupatenDropDown } from "../KabupatenDropDown/KabupatenDropDown";
import { KecamatanDropDown } from "../KecamatanDropDown/KecamatanDropDown";
import { PropinsiDropDown } from "../PropinsiDropDown/PropinsiDropDown";
import { setAlamat } from "../../features/alamat/alamat-slice";


interface IPropsAlamat {
    title: string;
}

const stackTokens: IStackTokens = { childrenGap: 8 };

export const AlamatGroup: React.FunctionComponent<IPropsAlamat> = ({title}) => {    
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
        <>
            <Label style={{borderBottom: '2px solid red', marginBottom: 8}}>
                {title}
            </Label>  
            <div style={{marginLeft: 8}}>
                <Stack tokens={stackTokens}>            
                    <PropinsiDropDown />
                    <KabupatenDropDown />
                    <KecamatanDropDown />
                    <DesaDropDown /> 
                </Stack>
            </div>
        </>
    );
}
