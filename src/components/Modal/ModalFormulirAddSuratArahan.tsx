import { FontSizes, FontWeights, getTheme, IconButton, IProgressIndicatorStyles, mergeStyleSets, Modal, PrimaryButton, ProgressIndicator, Stack } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { dragOptions } from "../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { cancelIcon, IModalFormulirSuratArahanProps } from "../FormulirPermohonan/FormulirSuratArahan/interfacePermohonanSuratArahan";
import { object, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TemplatePermohonanArahan } from "../FormTemplate/template-permohonan-arahan";

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        minWidth: 650
    },
    header: [
        // eslint-disable-next-line deprecation/deprecation
        theme.fonts.xLargePlus,
        {
          display: 'flex',
          flexDirection: 'column',
          borderTop: `4px solid ${theme.palette.themePrimary}`,
          color: theme.palette.neutralPrimary,
          alignItems: 'left',
          fontWeight: FontWeights.semibold,
          fontSize: FontSizes.large,
        },
    ],
    body: {
        flex: '4 4 auto',        
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        overflowX: 'hidden',
        selectors: {
          p: { margin: '14px 0' },
          'p:first-child': { marginTop: 0 },
          'p:last-child': { marginBottom: 0 },
        },
    },
    
});
const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
};
const progressStyle: IProgressIndicatorStyles = {
    root: {
        flex: '1 1 auto',
        width: '100%'
    },
    itemName: null,
    itemDescription: null,
    itemProgress: {
        padding: 0
    },
    progressBar: {
        background: '#ff6300',     
    },
    progressTrack: null,
};
const stackTokens = { childrenGap: 4 };

const permohonanSchema = object({
    registerPerusahaan: object({
        id: z.string(),
        tanggalRegistrasi: z.string(),
        kreator: object({
            hakAkses
            nik: z.string(),
            nama: z.string(),
            jenisKelamin: object({
                id: z.string(),
                nama: z.string()
            }),
            alamat: object({
                propinsi: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                kabupaten: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                kecamatan: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                desa: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                keterangan: z.string(),
            }),
            kontak: object({
                fax: z.string().optional(),
                telepone: z.string(),
                email: z.string().min(1, { message: "Harus diisi" }).email("bukan format email yang benar"),
            }),
            scanKTP: z.string()
        }).optional(),
        verifikator: object({
            nik: z.string(),
            nama: z.string(),
            jenisKelamin: object({
                id: z.string(),
                nama: z.string()
            }),
            alamat: object({
                propinsi: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                kabupaten: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                kecamatan: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                desa: object({
                    id: z.string(),
                    nama: z.string(),
                }),
                keterangan: z.string(),
            }),
            kontak: object({
                fax: z.string().optional(),
                telepone: z.string(),
                email: z.string().min(1, { message: "Harus diisi" }).email("bukan format email yang benar"),
            }),
            scanKTP: z.string()
        }).optional(),
        perusahaan: object({
            id: z.string(),
            nama: z.string(),
            modelPerizinan: object({
                id: z.string(),
                nama: z.string(),
                singkatan: z.string()
            }).optional(),
            skalaUsaha: object({
                id: z.string(),
                nama: z.string(),
                singkatan: z.string()
            }).optional(),
            pelakuUsaha: object({
                id: z.string(),
                nama: z.string(),
                singkatan: z.string(),
                kategoriPelakuUsaha: object({
                    id: z.string(),
                    nama: z.string()
                })

            }).optional(),
            alamat: object({
                propinsi: object({
                    id: z.string(),
                    nama: z.string(),
                }).optional(),
                kabupaten: object({
                    id: z.string(),
                    nama: z.string()
                }).optional(),
                kecamatan: object({
                    id: z.string(),
                    nama: z.string(),
                }).optional(),
                desa: object({
                    id: z.string(),
                    nama: z.string(),
                }).optional(),
                keterangan: z.string().optional(),
            }),
            kontak: object({
                fax: z.string().optional(),
                telepone: z.string().optional(),
                email: z.string().min(1, { message: "Harus diisi" }).email("bukan format email yang benar").optional(),
            }).optional()
        }),
        statusVerifikasi: z.boolean()
    }),  
    jenisPermohonanSuratArahan: object({
        id: z.string(),
        keterangan: z.string()
    }),
    statusWali: object({
        id: z.string(),
        nama: z.string()
    }),
    // penanggungJawabPermohonan:  object({
    //     id: z.string(),
    //     jabatan: object({
    //         id: z.string(),
    //         nama: z.string(),
    //     }),
    //     person: object({
    //         nik: z.string(),
    //         nama: z.string(),
    //         jenisKelamin: object({
    //             id: z.string(),
    //             nama: z.string()
    //         }),
    //         alamat: object({
    //             propinsi: object({
    //                 id: z.string(),
    //                 nama: z.string(),
    //             }),
    //             kabupaten: object({
    //                 id: z.string(),
    //                 nama: z.string(),
    //             }),
    //             kecamatan: object({
    //                 id: z.string(),
    //                 nama: z.string(),
    //             }),
    //             desa: object({
    //                 id: z.string(),
    //                 nama: z.string(),
    //             }),
    //             keterangan: z.string(),
    //         }),
    //         kontak: object({
    //             fax: z.string().optional(),
    //             telepone: z.string(),
    //             email: z.string().min(1, { message: "Harus diisi" }).email("bukan format email yang benar"),
    //         }),
    //         scanKTP: z.string().optional()
    //     }),
    // }),
    // regDokSuratKuasa: object({
    //     id: z.string(),
    // }),
});

type FormData = z.infer<typeof permohonanSchema>;

export const ModalFormulirAddSuratArahan: FC<IModalFormulirSuratArahanProps> = ({isModalOpen, hideModal, isDraggable}) => {  
    // const permohonan = useAppSelector((state) => state.per);
    //* local state *   
    const [motionKey, setMotionKey] = useState<string>('tahapPertama'); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const titleId = useId('Formulir Surat Arahan');
    //react hook form variable
    const methods = useForm<FormData>({
        resolver: zodResolver(permohonanSchema)
    });
    const {handleSubmit, reset} = methods;    
    // console.log(formState);
    // const { control, handleSubmit, setValue, reset, setError } = useForm<IRegisterPermohonanSuratArahan>({
    //     mode: 'onSubmit',
        // defaultValues: {
        //     id: null,
        //     registerPerusahaan: null,
        //     kategoriPermohonan: {
        //         id: '01',
        //         nama: ''
        //     },
        //     tanggalRegistrasi: null,
        //     pengurusPermohonan: null,
        //     statusWali: null,
        //     penanggungJawabPermohonan: null,
        //     statusTahapPemberkasan: null,
        //     daftarDokumenSyarat: [],
        //     daftarDokumenHasil: [],
        //     jenisPermohonanSuratArahan: null
        // }
    // });

    const handleCloseModal = useCallback(
        () => {
            reset();
            setMotionKey('tahapPertama');
            hideModal();
        },
        []
    );

    const simpanPermohonanArahan = useCallback(
        handleSubmit(
            (data) => {      
                console.log(data);            
                // var permohonan: IRegisterPermohonanSuratArahan = {
                //     id: null,
                //     kategoriPermohonan: {
                //         id: '01',
                //         nama: 'SURAT ARAHAN',
                //     },
                //     tanggalRegistrasi: null,                    
                //     registerPerusahaan: cloneDeep(data.registerPerusahaan) as IRegisterPerusahaan,                    
                //     jenisPermohonanSuratArahan: cloneDeep(data.jenisPermohonanSuratArahan),
                //     pengurusPermohonan: null,
                //     statusWali: null,
                //     penanggungJawabPermohonan: null,
                //     statusTahapPemberkasan: null,
                //     daftarDokumenSyarat: [],
                //     daftarDokumenHasil: [],
                //     uraianKegiatan: null
                // };
                // console.log(permohonan);
            }
        ),
        []
    );

    return (
        <Modal
            titleAriaId={titleId}
            isOpen={isModalOpen}
            onDismiss={handleCloseModal}
            isBlocking={true}
            containerClassName={contentStyles.container}
            dragOptions={isDraggable ? dragOptions : undefined}
        >
            <div className={contentStyles.header}>
            {
                isLoading && (
                    <ProgressIndicator styles={progressStyle}/>
                )
            }   
                <div style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 12px 14px 24px'}}
                >
                    <span id={titleId}>FORMULIR PERMOHONAN ARAHAN</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={handleCloseModal}
                    />
                </div>                  
            </div>
            <div className={contentStyles.body}>
                <Stack tokens={stackTokens} >
                    <FormProvider {...methods}>
                        <TemplatePermohonanArahan />
                        <Stack.Item align="end">
                            <PrimaryButton 
                                style={{marginTop: 16, width: 100}}
                                text="Simpan" 
                                onClick={simpanPermohonanArahan}
                            />
                        </Stack.Item>
                    </FormProvider>
                </Stack>
            </div>             
        </Modal>
    );
};

// const getSlideSubFormSuratArahan = (
//     {motionKey, setMotionKey, control, setValue, handleSubmit, setError, setIsLoading}: ISlideSubFormPermohomanSuratArahanParam) => {
//     let konten = null;
//     switch (motionKey) {
//         case 'tahapPertama':
//             konten = 
//                 <SubFormSuratArahanTahapPertama
//                     setIsLoading={setIsLoading}
//                 />;
//             break; 
//         case 'tahapKedua':
//             konten = 
//                 <SubFormSuratArahanTahapKedua
//                     control={control}
//                     setValue={setValue}
//                     setIsLoading={setIsLoading}
//                     setError={setError}
//                     setMotionKey={setMotionKey}
//                 />;
//             break; 
//         case 'tahapKetiga':
//             konten = 
//                 <SubFormSuratArahanTahapKetiga
//                     control={control}
//                     setValue={setValue}
//                     handleSubmit={handleSubmit}
//                     setIsLoading={setIsLoading}
//                     setError={setError}
//                     setMotionKey={setMotionKey}
//                 />;
//             break; 
//         default:
//             konten = null;
//             break;
//     }
//     return konten;
// };

