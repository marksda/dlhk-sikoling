import { motion } from "framer-motion";
import { FC, useState } from "react";
import { contentStyles, ISlideSubFormPermohomanSuratArahanParam, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";

export const SubFormSuratArahanTahapKedua: FC<ISlideSubFormPermohomanSuratArahanParam> = ({setMotionKey, setIsLoading}) => {
    // local state
    const [animFormPenanggungJawab, setAnimFormPenanggungJawab] = useState<string>('open');

    return (
        <motion.div 
            animate={animFormPenanggungJawab}
            variants={variantAnimSuratArahan}
            className={contentStyles.body} 
        >

        </motion.div>
    );
    
}