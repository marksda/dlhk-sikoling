import { IDropdownOption, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useMemo, useState } from "react";
import { UseFormSetError } from "react-hook-form";
import { useAppSelector } from "../../../app/hooks";
import { IRegisterPermohonan } from "../../../features/permohonan/register-permohonan-api-slice";
import { useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery } from "../../../features/perusahaan/register-perusahaan-api-slice";
import { IRegisterPerusahaan } from "../../../features/perusahaan/register-perusahaan-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { contentStyles, ISubFormSuratArahanProps, labelStyle, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";


interface ISubFormTahapPertamaSuratArahanProps extends ISubFormSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonan>;
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
                            text: t.perusahaan?.pelakuUsaha != undefined ?
                             `${t.perusahaan?.pelakuUsaha?.singkatan}. ${t.perusahaan?.nama}` : 
                             `${t.perusahaan?.nama}`
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

    const handleSetRegisterPerusahaan = useCallback(
        (item) => {
            let itemSelected = find(daftarRegisterPerusahaan, (i) => i.id == item.key) as IRegisterPerusahaan;
            console.log(itemSelected);          
            setValue("registerPerusahaan", itemSelected);
        },
        []
    )

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
                        onChangeItem={handleSetRegisterPerusahaan}
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