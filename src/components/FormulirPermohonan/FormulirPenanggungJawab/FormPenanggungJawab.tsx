import { motion } from "framer-motion";
import { FC, useState } from "react";
import { Control } from "react-hook-form";


export const SubFormPenanggungJawab: FC<ISlideSubFormPermohomanSuratArahanParam> = ({setMotionKey, setIsLoading}) => {
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