import { DefaultButton, DefaultPalette, Dropdown, IconButton, IDropdownOption, IIconProps, IStackItemStyles, IStackStyles, IStackTokens, ITooltipHostStyles, Label, PrimaryButton, Stack, TextField, Tooltip, TooltipHost } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { UseFormSetError, useWatch } from "react-hook-form";
import { useGetPegawaiByIdRegisterPerusahaanQuery } from "../../../features/repository/service/pegawai-api-slice";
import { IPegawai } from "../../../features/repository/ssot/pegawai-slice";
import { IRegisterPermohonanArahan } from "../../../features/permohonan/register-permohonan-api-slice";
import { IStatusWali, useGetAllStatusWaliPermohonanQuery } from "../../../features/permohonan/status-wali-api-slice";
import { ControlledFluentUiDropDown } from "../../ControlledDropDown/ControlledFluentUiDropDown";
import { backIcon } from "../../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { ModalFormulirAddPegawai } from "../../Modal/ModalFormulirAddPegawai";
import { contentStyles, durationAnimFormSuratArahan, ISlideSubFormPermohomanSuratArahanParam, ISubFormPermohonanSuratArahanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimSuratArahan } from "./interfacePermohonanSuratArahan";

interface ISubFormTahapKeduaSuratArahanProps extends ISubFormPermohonanSuratArahanProps {
    setError: UseFormSetError<IRegisterPermohonanArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const stackItemStyles: IStackItemStyles = {
    root: {
        margintop: 0,
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 8,
    },
};
// export const stackTokensVert = { childrenGap: 0 };
const sectionStackTokens: IStackTokens = { childrenGap: 2 };
const stackHorTokens = { childrenGap: 0 };
const calloutProps = { gapSpace: 0 };
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
const plusIcon: IIconProps = { iconName: 'CirclePlus' };

export const SubFormSuratArahanTahapKedua: FC<ISubFormTahapKeduaSuratArahanProps> = ({setMotionKey, setIsLoading, setError, setValue, control}) => {
    // local state
    const [animTahapKedua, setAnimTahapKedua] = useState<string>('open');    
    const [isModalAddPegawaiOpen, { setTrue: showModalAddPegawai, setFalse: hideModalAddPegawai }] = useBoolean(false);
    const tooltipAddPegawaiId = useId('toolTipAddPegawai');
    // const [idPj, setIdPj] = useState<string|undefined>(undefined);
    //react-form hook variable
    const [registerPerusahaan, statusWali, penanggungJawabPermohonan] = useWatch({
        control: control, 
        name: ['registerPerusahaan','statusWali', 'penanggungJawabPermohonan']
    });
    //rtk query perusahaan variable hook
    const { data: daftarStatusWali, error: errorFetchDataStatusWali,  isFetching: isFetchingDaftarStatusWali, isError: isErrorDataStatusWali } = useGetAllStatusWaliPermohonanQuery();
    const { data: daftarPegawai, error: errorDataPegawai} = useGetPegawaiByIdRegisterPerusahaanQuery(registerPerusahaan.id);
    // const {data: pJ, error: ErrorFetchPj} = useGetPersonByNikQuery(nik, {skip: skip});
    

    // useEffect(
    //     () => {
    //         if(nik.length == 16) {
    //             setSkip(false);
    //         }
    //         else {
    //             setSkip(true);
    //         }
    //     },
    //     [nik]
    // );

    // useEffect(
    //     () => {
    //         if(pJ != undefined) {
    //             setValue('penanggungJawabPermohonan', pJ);
    //         }
    //     },
    //     [pJ]
    // );

    
    const statusWaliOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarStatusWali != undefined) {
                return [
                    ...daftarStatusWali.map(
                        (t) => ({
                            key: t.id as string,
                            text: t.nama as string
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarStatusWali]
    );

    const daftarPegawaiOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarPegawai != undefined) {
                return [
                    ...daftarPegawai.map(
                        (t) => ({
                            key: `${t.id}`,
                            text: `${t.person?.nik} - ${t.person?.nama}`
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarPegawai]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimTahapKedua('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('tahapPertama');
                },
                durationAnimFormSuratArahan*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetStatusWali = useCallback(
        (item) => {
            let itemSelected = find(daftarStatusWali, (i) => i.id == item.key) as IStatusWali;
            // dispatch(setRegisterPerusahaan(itemSelected));            
            setValue("statusWali", itemSelected);
        },
        [daftarStatusWali]
    );

    const handleSetPenanggungJawab = useCallback(
        (event, item) => {
            var itemSelected = find(daftarPegawai, (i) => i.id == item.key) as IPegawai;
            setValue("penanggungJawabPermohonan", itemSelected);
        },
        [daftarPegawai]
    );

    const processNextStep = useCallback(
        () => {
            setAnimTahapKedua('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('tahapKetiga');
                },
                durationAnimFormSuratArahan*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div 
            animate={animTahapKedua}
            variants={variantAnimSuratArahan}
            className={contentStyles.body} 
        >
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, alignItems: 'center'}}}>                    
                <IconButton 
                    iconProps={backIcon} 
                    title="Back" 
                    ariaLabel="Back"
                    onClick={processBackToPreviousStep} 
                    styles={{
                        root: {
                            borderStyle: 'none',
                            borderRadius: '50%',
                            padding: 0,
                            marginTop: 2,
                        }
                    }}/>
                <Label styles={labelTitleBack}> 
                    {registerPerusahaan.perusahaan.pelakuUsaha != null ?
                        `${registerPerusahaan.perusahaan.pelakuUsaha.singkatan}. ${registerPerusahaan.perusahaan.nama}` : registerPerusahaan.perusahaan.nama
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Penanggung jawab permohonan</Label>
                <Label styles={subLabelStyle}>Status penanggung jawab permohonan selain pemilik/direktur wajib menyertakan surat kuasa perusahaan. Pilihan dokumen surat kuasa akan muncul apabila sudah diupload, jika belum maka tekan tombol file untuk upload terlebih dahulu.</Label>
            </Stack>
            <Stack styles={{root: { width: 450, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Status penanggung jawab"
                        placeholder="Pilih status penanggung jawab permohonan"
                        dropdownWidth="auto"
                        options={statusWaliOptions}
                        required
                        name="statusWali"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetStatusWali}
                        selectedKey={statusWali != null ? statusWali.id : undefined}
                    />
                </Stack.Item>
                {
                    statusWali == null ?
                    null:(
                    statusWali.id == '01' ? null :
                    <Stack.Item>
                        <Stack horizontal tokens={sectionStackTokens}>
                            <Stack.Item grow align="center">
                                <ControlledFluentUiDropDown
                                    label="Dokumen surat kuasa"
                                    options={[]}
                                    placeholder="Pilih dokumen"
                                    name="jenisPermohonan"
                                    control={control}
                                />     
                            </Stack.Item>
                            <Stack.Item align="end">                            
                                <DefaultButton text="File"/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    )
                }                     
                <Stack.Item>
                    <Label>Identitas penanggung jawab</Label>
                </Stack.Item>
                <Stack.Item styles={stackItemStyles}>
                    <Stack horizontal tokens={stackHorTokens} styles={{root: { width: 438, alignItems: 'left'}}}>
                        <Stack.Item grow>
                            <Dropdown
                                label="Nik"
                                placeholder="Pilih nik status penanggung jawab permohonan"
                                selectedKey={penanggungJawabPermohonan != null ? penanggungJawabPermohonan.nik : undefined}
                                onChange={handleSetPenanggungJawab}
                                options={daftarPegawaiOptions}
                                disabled={statusWali == null ?  true: false}
                            />
                        </Stack.Item>
                        <Stack.Item align="end">                            
                            <TooltipHost
                                id={tooltipAddPegawaiId}
                                content="Klik untuk tambah pilihan Nik"
                                calloutProps={calloutProps}
                                styles={hostStyles}
                            >
                                <IconButton iconProps={plusIcon} aria-label="Plus" onClick={showModalAddPegawai}/>
                            </TooltipHost>
                        </Stack.Item>
                    </Stack>                    
                    <Stack.Item styles={{root: {marginTop: 8, padding: 8, background: '#a0e4e9'}}}>
                        <Stack horizontal>
                            <Stack.Item styles={{root: {width: 80}}}>                                
                                <span>Nama</span> 
                            </Stack.Item>
                            <Stack.Item grow>
                                : {penanggungJawabPermohonan != null ? penanggungJawabPermohonan.person.nama: ''}
                            </Stack.Item>
                        </Stack>
                        <Stack horizontal>
                            <Stack.Item styles={{root: {width: 80}}} >                                
                                <span>Jabatan</span> 
                            </Stack.Item>
                            <Stack.Item>
                                : {penanggungJawabPermohonan != null ? penanggungJawabPermohonan.jabatan.nama: ''}
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>            
                </Stack.Item>                 
                <Stack.Item align="end">
                    <PrimaryButton 
                        style={{width: 100, marginTop: 8}}
                        text={'Lanjut'}
                        onClick={processNextStep}
                        disabled={penanggungJawabPermohonan == null ? true:false}
                    />
                </Stack.Item>
            </Stack>
            {
                isModalAddPegawaiOpen == true ? 
                <ModalFormulirAddPegawai
                    isModalOpen={isModalAddPegawaiOpen}
                    hideModal={hideModalAddPegawai}
                    isDraggable={true}
                /> : null  
            }
        </motion.div>
    );
    
}