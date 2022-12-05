import { motion } from "framer-motion";
import { FC, useState } from "react";
import { ISubFormRegistrasiProps, variantPassword } from "./InterfaceRegistrasiForm";

export const SubFormPasswordRegistrasi: FC<ISubFormRegistrasiProps> = ({setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue}) => {
    // local state
    const [animPassword, setAnimPassword] = useState<string>('open');
    //rendered function
    return(
        <motion.div
            animate={animPassword}
            variants={variantPassword}
        >
            
        </motion.div>
    );
}