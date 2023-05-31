import { DefaultButton, DefaultEffects, DefaultPalette, Dropdown, IconButton, IDropdownOption, IIconProps, IStackItemStyles, IStackTokens, ITooltipHostStyles, Label, Stack, StackItem, TextField, TooltipHost } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import find from "lodash.find";
import { useCallback, useMemo, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useAppSelector } from "../../app/hooks";
// import { useGetPegawaiByIdRegisterPerusahaanQuery } from "../../features/pegawai/pegawai-api-slice";
import { IPegawai } from "../../features/pegawai/pegawai-slice";
import { IJenisPermohonanSuratArahan, useGetAllJenisPermohonanSuratArahanQuery } from "../../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { IStatusWali, useGetDaftarStatusWaliPermohonanByFiltersQuery } from "../../features/permohonan/status-wali-api-slice";
// import { useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery } from "../../features/perusahaan/register-perusahaan-api-slice";
import { IRegisterPerusahaan } from "../../features/perusahaan/register-perusahaan-slice";
import { ModalFormulirAddPegawai } from "../Modal/ModalFormulirAddPegawai";
import { TemplateDokumenSyaratArahan } from "./template-dok-syarat-arahan";


const sectionStackTokens: IStackTokens = { childrenGap: 2 };
const stackItemStyles: IStackItemStyles = {
    root: {
        margintop: 0,
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 8,
    },
};
const stackHorTokens = { childrenGap: 16 };
const calloutProps = { gapSpace: 0 };
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
const plusIcon: IIconProps = { iconName: 'CirclePlus' };
const containerRedStyles: React.CSSProperties = {    
    display: "inline-block", 
    boxShadow: DefaultEffects.elevation4, 
    borderTop: '2px solid #E81123', 
    borderRadius: 3, 
    padding: '0px 8px',
    background: 'white',
};

const containerGreenStyles: React.CSSProperties = {    
    display: "inline-block", 
    boxShadow: DefaultEffects.elevation4, 
    borderTop: '2px solid #0078D7', 
    width: 640,
    borderRadius: 3, 
    padding: '0px 8px 8px 8px',
    background: 'white',
};


export const TemplatePermohonanArahan = () => {
    //redux hook 
    const token = useAppSelector(state => state.token);
    //react-form hook
    const {control, resetField} = useFormContext();
    const [
        registerPerusahaan, jenisPermohonanSuratArahan,
        statusWali, penanggungJawabPermohonan
    ] = useWatch({
        control: control, 
        name: [
            'registerPerusahaan', 'jenisPermohonanSuratArahan',
            'statusWali', 'penanggungJawabPermohonan'
        ]
    });
    // console.log(penanggungJawabPermohonan);

    //local state 
    const [isiUraian, setIsiUraian] = useState<string>('');

    const [isModalAddPegawaiOpen, { setTrue: showModalAddPegawai, setFalse: hideModalAddPegawai }] = useBoolean(false);
    const tooltipAddPegawaiId = useId('toolTipAddPegawai');

    //rtk query perusahaan variable hook
    // const { data: daftarRegisterPerusahaan, error: errorFetchDataPerusahaan,  isFetching: isFetchingDaftarRegisterPerusahaan, isError } = useGetRegisterPerusahaanTanpaRegisterDokumenByIdLinkKepemilikanQuery(token.userId as string);
    const { data: daftarJenisPermohonanSuratarahan, error: errorFetchDataJenisPermohonanSuratArahan,  isFetching: isFetchingDaftarJenisPermohonanSuratarahan, isError: isErrorJenisPermohonanSuratarahan } = useGetAllJenisPermohonanSuratArahanQuery();
    const { data: daftarStatusWali, error: errorFetchDataStatusWali,  isFetching: isFetchingDaftarStatusWali, isError: isErrorDataStatusWali } = useGetDaftarStatusWaliPermohonanByFiltersQuery({
        pageNumber: 0,
        pageSize: 0,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
    });
    const { data: daftarPegawai, error: errorDataPegawai} = useGetPegawaiByIdRegisterPerusahaanQuery(
        registerPerusahaan != undefined ? registerPerusahaan.id:null, {skip: registerPerusahaan == undefined ? true:false});
    
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

    const jenisPermohonanSuratArahanOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarJenisPermohonanSuratarahan != undefined) {
                return [
                    ...daftarJenisPermohonanSuratarahan.map(
                        (t) => ({
                            key: t.id!,
                            text: `${t.keterangan}`
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarJenisPermohonanSuratarahan]
    );

    const statusWaliOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarStatusWali != undefined) {
                return [
                    ...daftarStatusWali.map(
                        (t) => ({
                            key: t.id!,
                            text: `${t.nama}`
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

    const handleChangeRegisterPerusahaan = useCallback(
        (item): IRegisterPerusahaan => {
            var itemSelected = find(daftarRegisterPerusahaan, (i) => i.id == item.key) as IRegisterPerusahaan;
            resetField('penanggungJawabPermohonan');
            return itemSelected;
        },
        [daftarRegisterPerusahaan]
    );

    const handleChangeStatusPermohonan = useCallback(
        (item) => {
            var itemSelected = find(daftarJenisPermohonanSuratarahan, (i) => i.id == item.key) as IJenisPermohonanSuratArahan;  
            return itemSelected;
        },
        [daftarJenisPermohonanSuratarahan]
    );

    const handleChangeStatusWali= useCallback(
        (item) => {
            var itemSelected = find(daftarStatusWali, (i) => i.id == item.key) as IStatusWali;
            return itemSelected;
        },
        [daftarStatusWali]
    );

    const handleChangePenanggungJawab = useCallback(
        (item) => {
            var itemSelected = find(daftarPegawai, (i) => i.id == item.key) as IPegawai;
            return itemSelected;
        },
        [daftarPegawai]
    );
    
    return (
        <>
        <Stack horizontal tokens={stackHorTokens}>
            <Stack style={containerGreenStyles}>
                <Stack.Item>
                    <Controller 
                        name="registerPerusahaan"
                        control={control}
                        render={
                            ({
                                field: {onChange},
                                fieldState: {error}
                            }) => 
                            <Dropdown 
                                label="Pemrakarsa"
                                placeholder="Pilih pemrakarsa"
                                options={perusahaanOptions}
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, selectedItem) => {
                                    onChange(handleChangeRegisterPerusahaan(selectedItem));
                                }}
                                required
                                selectedKey={registerPerusahaan != undefined ? registerPerusahaan.id : undefined}
                            />
                        }
                    />
                </Stack.Item>
                <Stack.Item>
                    <Stack horizontal tokens={stackHorTokens} styles={{root: {alignItems: 'left'}}}>
                        <Stack.Item>
                            <Controller 
                                name="jenisPermohonanSuratArahan"
                                control={control}
                                render={
                                    ({
                                        field: {onChange},
                                        fieldState: {error}
                                    }) => 
                                    <Dropdown 
                                        label="Status permohonan"
                                        placeholder="--Pilih--"
                                        options={jenisPermohonanSuratArahanOptions}
                                        errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                        onChange={(e, selectedItem) => {
                                            onChange(handleChangeStatusPermohonan(selectedItem));
                                        }}
                                        styles={{root:{width: 150}}}
                                        required
                                        disabled={registerPerusahaan == undefined ? true : false}
                                        selectedKey={jenisPermohonanSuratArahan != undefined ? jenisPermohonanSuratArahan.id : undefined}
                                    />
                                }
                            />
                        </Stack.Item>
                        <Stack.Item grow>
                            <Controller 
                                name="statusWali"
                                control={control}
                                render={
                                    ({
                                        field: {onChange},
                                        fieldState: {error}
                                    }) => 
                                    <Dropdown 
                                        label="Status penanggung jawab"
                                        placeholder="Pilih status penanggung jawab"
                                        options={statusWaliOptions}
                                        errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                        onChange={(e, selectedItem) => {
                                            onChange(handleChangeStatusWali(selectedItem));
                                        }}
                                        required
                                        disabled={jenisPermohonanSuratArahan == undefined ? true : false}
                                        selectedKey={statusWali != undefined ? statusWali.id : undefined}
                                    />
                                }
                            />
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
                <StackItem>
                    <Controller
                        name="uraianKegiatan"
                        control={control}
                        render={
                            ({
                                field: {name: fieldName, onChange, value},
                                fieldState: {error}
                            }) => 
                            <TextField 
                                name={fieldName}
                                label={
                                    jenisPermohonanSuratArahan == undefined ?
                                    'Deskripsi singkat kegiatan usaha' : jenisPermohonanSuratArahan.id == 1 ?
                                    'Deskripsi singkat kegiatan usaha' : 'Deskripsi singkat perubahan kegiatan usaha'
                                }
                                required multiline autoAdjustHeight
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, v) => {
                                    setIsiUraian(v||'');
                                    onChange(v);
                                }}
                                value={isiUraian}
                                disabled={statusWali ? false:true}
                            />
                        }
                    />
                </StackItem>
                <Stack.Item>
                    <Label>Penanggung jawab permohonan</Label>
                </Stack.Item>
                <Stack.Item styles={stackItemStyles}>
                    <Stack horizontal tokens={sectionStackTokens}>
                        <Stack.Item grow>
                            <Controller 
                                name="penanggungJawabPermohonan"
                                control={control}
                                render={
                                    ({
                                        field: {onChange},
                                        fieldState: {error}
                                    }) =>
                                    <Dropdown
                                        placeholder="Pilih penanggung jawab"
                                        options={daftarPegawaiOptions}
                                        errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                        onChange={
                                            (e, selectedItem) => {
                                                onChange(handleChangePenanggungJawab(selectedItem));
                                            }
                                        }                                 
                                        selectedKey={penanggungJawabPermohonan?penanggungJawabPermohonan.id:null}
                                        disabled={isiUraian ? false:true}
                                    />
                                }
                            />
                        </Stack.Item>
                        <Stack.Item>                            
                            <TooltipHost
                                id={tooltipAddPegawaiId}
                                content="Klik untuk tambah pilihan Nik"
                                calloutProps={calloutProps}
                                styles={hostStyles}
                            >
                                <IconButton 
                                    iconProps={plusIcon} 
                                    aria-label="Plus" 
                                    onClick={showModalAddPegawai}
                                    disabled={isiUraian == undefined ?  true: false}/>
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
                {
                    statusWali == null ?
                    null:(
                    statusWali.id == '01' ? null :
                    <Stack.Item>
                        <Stack horizontal tokens={sectionStackTokens}>
                            <Stack.Item>
                                <Controller 
                                    name="dokSuratKuasa"
                                    control={control}
                                    render={
                                        ({
                                            field: {onChange},
                                            fieldState: {error}
                                        }) => 
                                        <Dropdown 
                                            label="Dokumen surat kuasa"
                                            placeholder="Pilih dokumen surat kuasa"
                                            options={statusWaliOptions}
                                            errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                            onChange={(e, selectedItem) => {
                                                onChange(handleChangeStatusWali(selectedItem));
                                            }}
                                            styles={{root:{width: 250}}}
                                            required
                                        />
                                    }
                                />
                            </Stack.Item>
                            <Stack.Item align="end">                            
                                <DefaultButton text="File"/>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    )
                }
            </Stack>  
            <Stack grow style={containerRedStyles}>
                <Stack.Item>
                    <Label>Dokumen persyaratan</Label>
                </Stack.Item>
                <Stack.Item>                
                    <TemplateDokumenSyaratArahan />
                </Stack.Item>
            </Stack>
        </Stack>
        {
            isModalAddPegawaiOpen == true ? 
            <ModalFormulirAddPegawai
                isModalOpen={isModalAddPegawaiOpen}
                hideModal={hideModalAddPegawai}
                isDraggable={true}
            /> : null  
        }    
        </>
    );
};