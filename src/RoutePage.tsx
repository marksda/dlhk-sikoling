import React from "react"
import { PropinsiDropDown } from "./components/PropinsiDropDown/PropinsiDropDown"
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
        <div style={{margin: 16}}><PropinsiDropDown /></div>    
    )
}

export default RoutePage