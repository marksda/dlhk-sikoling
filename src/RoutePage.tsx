import { DefaultEffects } from "@fluentui/react";
import React from "react";
// import { FormulirPerson } from "./components/FormulirPerson/FormulirPerson";
import { FormulirPemrakarsa } from "./components/FormulirPemrakarsa/FormulirPemrakarsa";
// import { Login } from './features/login/login'
// import { useAppSelector } from './app/hooks'

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
        <div style={{display: "inline-block", boxShadow: DefaultEffects.elevation8, 
            borderTop: '2px solid #0078D7', borderRadius: 3, padding: 16, margin: 16}}>
            <FormulirPemrakarsa />   
        </div>
         
    )
}

export default RoutePage