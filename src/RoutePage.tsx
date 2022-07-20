import { DefaultEffects, IIconProps, PrimaryButton } from "@fluentui/react";
import React from "react";
import { AktaGroup } from "./components/AktaGroup/AktaGroup";
// import { FormulirPerson } from "./components/FormulirPerson/FormulirPerson";
// import { FormulirPemrakarsa } from "./components/FormulirPemrakarsa/FormulirPemrakarsa";
// import { Login } from './features/login/login'
// import { useAppSelector } from './app/hooks'

const addIcon: IIconProps = { iconName: 'Save' };

const RoutePage: React.FunctionComponent = () => {
    // const userProfile = useAppSelector(state => state.login.user_profile)

    // if(userProfile != null) {
    //     return (
    //         <Login/>
    //     )
    // }
    // else {
    //     return (
    //         <div>sudah login</div>
    //     )
    // }   

    const onButtonSimpanClick = () => { 
        //aksi
    };
    
    return (
        <div style={{display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid #0078D7', borderRadius: 3, padding: 16, margin: 16}}>
            <AktaGroup
                title="Akta Pendirian"
                name="aktaPemrakarsa"
                />
            <PrimaryButton 
                text="Simpan" 
                iconProps={addIcon}
                onClick={onButtonSimpanClick} 
                style={{marginTop: 24, width: 100}}
                />
        </div>
         
    )
}

export default RoutePage