import { DefaultEffects, PrimaryButton } from "@fluentui/react";
import React from "react";
// import { AktaGroup } from "./components/AktaGroup/AktaGroup";
import { FormulirLogin } from "./components/FormulirLogin/FormulirLogin";
import { IContainerUploadStyle, UploadFilesFluentUi } from "./components/UploadFiles/UploadFilesFluentUI";
// import { FormulirPerson } from "./components/FormulirPerson/FormulirPerson";
// import { FormulirPemrakarsa } from "./components/FormulirPemrakarsa/FormulirPemrakarsa";
// import { Login } from './features/login/login'
// import { useAppSelector } from './app/hooks'

// const addIcon: IIconProps = { iconName: 'Save' };

const containerStyle: IContainerUploadStyle = {
    width: 300, 
    height: 100, 
    backgroundColor: '#ECECEC',
};

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
        <div style={{display: "inline-block", boxShadow: DefaultEffects.elevation4, 
            borderTop: '2px solid #0078D7', borderRadius: 3, padding: 48, margin: 16}}>
            <UploadFilesFluentUi 
                label='Upload File Hasil Scan KTP'
                showPreview={false}
                showListFile={false}
                containerStyle={containerStyle}
            />
            <PrimaryButton 
                text="Berikutnya" 
                onClick={onButtonSimpanClick} 
                style={{marginTop: 24, width: 100, float: 'right'}}
                />
        </div>         
    );
}

export default RoutePage