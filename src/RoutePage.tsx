import React from "react";
import { FormulirLogin } from "./components/FormulirLogin/FormulirLogin";


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