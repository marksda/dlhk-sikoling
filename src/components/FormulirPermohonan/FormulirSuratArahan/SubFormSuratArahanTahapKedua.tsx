import { motion } from "framer-motion";
import { FC, useState } from "react";
import { UseFormSetError, useWatch } from "react-hook-form";
import { IRegisterPermohonanSuratArahan } from "../../../features/permohonan/register-permohonan-api-slice";
import { contentStyles, ISubFormPermohonanSuratArahanProps, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";


interface ISubFormTahapKeduaSuratArahanProps extends ISubFormPermohonanSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonanSuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SubFormSuratArahanTahapPertama: FC<ISubFormTahapKeduaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    //react-form hook variable
    const [jenisPermohonanSuratArahan] = useWatch({
        control: control, 
        name: ['jenisPermohonanSuratArahan']
    });
    // local state
    const [animTahapKedua, setAnimTahapKedua] = useState<string>('open');

    return (
        <motion.div 
            animate={animTahapKedua}
            variants={variantAnimSuratArahan}
            className={contentStyles.body} 
        >

        </motion.div>
    );
    
};