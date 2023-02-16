import { FontSizes, FontWeights, getTheme, IconButton, IProgressIndicatorStyles, mergeStyleSets, Modal, PrimaryButton, ProgressIndicator, Stack } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { dragOptions } from "../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { cancelIcon, IModalFormulirSuratArahanProps } from "../FormulirPermohonan/FormulirSuratArahan/interfacePermohonanSuratArahan";
import { object, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TemplatePermohonanArahan } from "../FormTemplate/template-permohonan-arahan";
import { DaftarDokumen, DokumenNibSchema, JenisPermohonanArahanSchema, PenanggungJawabSchema,  RegisterPerusahaanSchema, StatusWaliSchema } from "../../features/schema-resolver/zod-schema";
import { IRegisterPermohonanArahan, useAddRegisterPermohonanMutation } from "../../features/permohonan/register-permohonan-api-slice";
import cloneDeep from "lodash.clonedeep";
import { IRegisterPerusahaan } from "../../features/perusahaan/register-perusahaan-slice";
import { IJenisPermohonanSuratArahan } from "../../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { IPegawai } from "../../features/pegawai/pegawai-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        minWidth: 670
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

const permohonanArahanSchema = object({
    registerPerusahaan: RegisterPerusahaanSchema,  
    jenisPermohonanSuratArahan: JenisPermohonanArahanSchema,
    statusWali: StatusWaliSchema,
    penanggungJawabPermohonan: PenanggungJawabSchema,
    uraianKegiatan: z.string().default(''),
    daftarDokumenSyarat: DaftarDokumen
});

type FormData = z.infer<typeof permohonanArahanSchema>;

export const ModalFormulirAddSuratArahan: FC<IModalFormulirSuratArahanProps> = ({isModalOpen, hideModal, isDraggable}) => {  
    //* local state *   
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const titleId = useId('Formulir Surat Arahan');
    //*react hook form variable*
    const methods = useForm<FormData>({
        resolver: zodResolver(permohonanArahanSchema)
    });
    const {control, handleSubmit, reset} = methods;    
    const [daftarDokumenSyarat] = useWatch({
        control,
        name: ['daftarDokumenSyarat']
    });
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

    const [addRegisterPermohonan, ] = useAddRegisterPermohonanMutation();

    const handleCloseModal = useCallback(
        () => {
            reset();
            hideModal();
        },
        []
    );

    const simpanPermohonanArahan = useCallback(
        handleSubmit(
            (data) => {             
                var permohonan: IRegisterPermohonanArahan = {
                    id: null,
                    kategoriPermohonan: {
                        id: '01',
                        nama: 'SURAT ARAHAN',
                    },
                    tanggalRegistrasi: null,                    
                    registerPerusahaan: cloneDeep(data.registerPerusahaan) as IRegisterPerusahaan,      
                    pengurusPermohonan: null,              
                    statusWali: cloneDeep(data.statusWali),
                    penanggungJawabPermohonan: cloneDeep(data.penanggungJawabPermohonan) as IPegawai,
                    statusTahapPemberkasan: null,
                    daftarDokumenSyarat: cloneDeep(data.daftarDokumenSyarat) as IRegisterDokumen[],
                    daftarDokumenHasil: null,
                    jenisPermohonanSuratArahan: cloneDeep(data.jenisPermohonanSuratArahan) as IJenisPermohonanSuratArahan,
                    uraianKegiatan: data.uraianKegiatan
                };
                console.log(permohonan);
                addRegisterPermohonan(permohonan);
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
                    <span id={titleId}>Formulir Permohonan Arahan</span>
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
                                disabled={ (daftarDokumenSyarat == undefined) || isLoading ? true:false }
                            />
                        </Stack.Item>
                    </FormProvider>
                </Stack>
            </div>             
        </Modal>
    );
};