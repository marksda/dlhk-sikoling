import React from "react"
import { Login } from './features/login/login'
import { useAppSelector } from './app/hooks'

const RoutePage: React.FunctionComponent = () => {
    const userProfile = useAppSelector(state => state.login.user_profile)

    if(userProfile != null) {
        return (
            <Login/>
        )
    }
    else {
        return (
            <div>sudah login</div>
        )
    }   
}

export default RoutePage