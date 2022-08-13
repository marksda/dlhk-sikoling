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
    
    return (
        <FormulirLogin />
    );
}

export default RoutePage