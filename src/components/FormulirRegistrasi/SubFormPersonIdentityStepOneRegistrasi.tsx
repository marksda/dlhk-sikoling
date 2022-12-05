import { motion } from "framer-motion";
import { FC, useState } from "react";
import { ISubFormRegistrasiProps, variantPID } from "./InterfaceRegistrasiForm";

export const SubFormPersonIdentityStepOneRegistrasi: FC<ISubFormRegistrasiProps> = ({setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue}) => {
    // local state
    const [animPid, setAnimPid] = useState<string>('open');

    return(
        <motion.div
            animate={animPid}
            variants={variantPID}
        >

        </motion.div>
    );
};