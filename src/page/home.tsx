import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useEffect } from "react";


export const Home = () => {
    const token = useAppSelector((state) => state.token);
    const navigate = useNavigate();

    useEffect(
        () => {
            switch (token.hakAkses) {
                case 'Administrator':
                    navigate("/admin");
                    break;
                case 'Umum':
                    navigate("/pemrakarsa");
                    break;
                default:
                    navigate("/login");
                    break;
            }
        },
        [token]
    );
    
    return (
        <></>
    ); 
}