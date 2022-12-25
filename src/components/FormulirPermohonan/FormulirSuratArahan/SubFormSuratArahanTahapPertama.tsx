import { Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useState } from "react";
import { UseFormSetError } from "react-hook-form";
import { ISuratArahan } from "../../../features/dokumen/surat-arahan/surat-arahan-api-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { contentStyles, ISubFormSuratArahanProps, labelStyle, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfaceSuratArahan";

interface ISubFormTahapPertamaSuratArahanProps extends ISubFormSuratArahanProps {
    setError: UseFormSetError<ISuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const SubFormSuratArahanTahapPertama: FC<ISubFormTahapPertamaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    //react-form-hook variable
    // const [modelPerizinan] = useWatch({
    //     control: control, 
    //     name: ['modelPerizinan']
    // });
    // local state
    const [animTahapPertama, setAnimTahapPertama] = useState<string>('open');

    return (
        <motion.div 
            animate={animTahapPertama}
            variants={variantAnimSuratArahan}
            className={contentStyles.body} 
        >
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Jenis Surat Arahan?</Label>
                <Label styles={subLabelStyle}>Pilih baru jika belum memiliki dokumen lingkungan dan pilih perubahan jika ingin mengubah dokumen lingkungan yang sudah ada.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Jenis Surat Arahan"
                        placeholder="Pilih jenis surat arahan"
                        options={options}
                        required
                        name="modelPerizinan"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetModelPerizinan}
                        selectedKey={modelPerizinan.id != '' ? modelPerizinan.id : undefined}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                />
            </Stack>   
        </motion.div>
    );
};