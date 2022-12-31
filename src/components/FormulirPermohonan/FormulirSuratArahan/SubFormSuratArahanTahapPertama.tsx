import { IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useMemo, useState } from "react";
import { UseFormSetError } from "react-hook-form";
import { useAppSelector } from "../../../app/hooks";
import { ISuratArahan } from "../../../features/dokumen/surat-arahan-api-slice";
import { useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery } from "../../../features/perusahaan/register-perusahaan-api-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { IListItemRegisterPerusahaan } from "../../DataList/perusahaan/InterfaceDataListPerusahaan";
import { contentStyles, ISubFormSuratArahanProps, labelStyle, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfaceSuratArahan";


interface ISubFormTahapPertamaSuratArahanProps extends ISubFormSuratArahanProps {
    setError: UseFormSetError<ISuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const SubFormSuratArahanTahapPertama: FC<ISubFormTahapPertamaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    //redux variable state
    const token = useAppSelector(state => state.token);
    // local state
    const [animTahapPertama, setAnimTahapPertama] = useState<string>('open');
    //rtk query perusahaan variable hook
    const { data: daftarRegisterPerusahaan, error: errorFetchDataPerusahaan,  isFetching: isFetchingDaftarRegisterPerusahaan, isError } = useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery(token.userId as string);

    const perusahaanOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarRegisterPerusahaan != undefined) {
                return [
                    ...daftarRegisterPerusahaan.map(
                        (t) => ({
                            key: t.id!,
                            text: `${t.perusahaan?.pelakuUsaha?.singkatan}. ${t.perusahaan?.nama}`
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarRegisterPerusahaan]
    );

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
                        label="Pemrakarsa"
                        placeholder="Pilih pemrakarsa"
                        options={perusahaanOptions}
                        required
                        name="perusahaan"
                        rules={{ required: "harus diisi" }} 
                        control={control}
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