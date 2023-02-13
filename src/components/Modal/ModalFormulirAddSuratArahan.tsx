import { FontSizes, FontWeights, getTheme, IconButton, IProgressIndicatorStyles, mergeStyleSets, Modal, ProgressIndicator } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { dragOptions } from "../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { cancelIcon, IModalFormulirSuratArahanProps, ISlideSubFormPermohomanSuratArahanParam } from "../FormulirPermohonan/FormulirSuratArahan/interfacePermohonanSuratArahan";
import { SubFormSuratArahanTahapPertama } from "../FormulirPermohonan/FormulirSuratArahan/SubFormSuratArahanTahapPertama";
import { IRegisterPermohonanSuratArahan } from "../../features/permohonan/register-permohonan-api-slice";
import { SubFormSuratArahanTahapKetiga } from "../FormulirPermohonan/FormulirSuratArahan/SubFormSuratArahanTahapKetiga";
import { SubFormSuratArahanTahapKedua } from "../FormulirPermohonan/FormulirSuratArahan/SubFormSuratArahanTahapKedua";
import { object, z } from "zod";
import { useAppSelector } from "../../app/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        minWidth: 400
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

const permohonanSchema = object({
    registerPerusahaan: object({
        id: z.string(),
        tanggalRegistrasi: z.string().optional(),
        kreator: object({

        }).optional(),
        verifikator: object({

        }).optional(),
        perusahaan: object({

        })
    }),  
    jenisPermohonanSuratArahan: object({
        id: z.string(),
        keterangan: z.string()
    }),
});

type FormData = z.infer<typeof permohonanSchema>;

export const ModalFormulirAddSuratArahan: FC<IModalFormulirSuratArahanProps> = ({isModalOpen, hideModal, isDraggable}) => {  
    // const permohonan = useAppSelector((state) => state.per);
    //* local state *   
    const [motionKey, setMotionKey] = useState<string>('tahapPertama'); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const titleId = useId('Formulir Surat Arahan');
    //react hook form variable
    // const methods = useForm<FormData>({
    //     resolver: zodResolver(permohonanSchema),
    // });
    // const {handleSubmit} = methods;    
    const { control, handleSubmit, setValue, reset, setError } = useForm<IRegisterPermohonanSuratArahan>({
        mode: 'onSubmit',
        defaultValues: {
            id: null,
            registerPerusahaan: null,
            kategoriPermohonan: {
                id: '01',
                nama: ''
            },
            tanggalRegistrasi: null,
            pengurusPermohonan: null,
            statusWali: null,
            penanggungJawabPermohonan: null,
            statusTahapPemberkasan: null,
            daftarDokumenSyarat: [],
            daftarDokumenHasil: [],
            jenisPermohonanSuratArahan: null
        }
    });

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
            async (data) => {                  
                var permohonan: IRegisterPermohonanSuratArahan = {
                    id: null,
                    kategoriPermohonan: {
                        id: '01',
                        nama: 'SURAT ARAHAN',
                    },
                    tanggalRegistrasi: null,                    
                    registerPerusahaan: cloneDeep(data.registerPerusahaan),                    
                    jenisPermohonanSuratArahan: cloneDeep(data.jenisPermohonanSuratArahan),
                    pengurusPermohonan: null,
                    statusWali: null,
                    penanggungJawabPermohonan: null,
                    statusTahapPemberkasan: null,
                    daftarDokumenSyarat: [],
                    daftarDokumenHasil: [],
                    uraianKegiatan: null
                };
                console.log(permohonan);
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
                    <span id={titleId}>Formulir Permohonan Surat Arahan</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={handleCloseModal}
                    />
                </div>                  
            </div>
            <FormProvider {...methods}>
            {                
                getSlideSubFormSuratArahan({
                    motionKey, 
                    setMotionKey,
                    control, 
                    setValue,
                    reset,
                    handleSubmit,
                    setError,
                    setIsLoading
                })
            }   
            </FormProvider>
             
        </Modal>
    );
};

const getSlideSubFormSuratArahan = (
    {motionKey, setMotionKey, control, setValue, handleSubmit, setError, setIsLoading}: ISlideSubFormPermohomanSuratArahanParam) => {
    let konten = null;
    switch (motionKey) {
        case 'tahapPertama':
            konten = 
                <SubFormSuratArahanTahapPertama
                    control={control}
                    setValue={setValue}
                    setIsLoading={setIsLoading}
                    setError={setError}
                    setMotionKey={setMotionKey}
                />;
            break; 
        case 'tahapKedua':
            konten = 
                <SubFormSuratArahanTahapKedua
                    control={control}
                    setValue={setValue}
                    setIsLoading={setIsLoading}
                    setError={setError}
                    setMotionKey={setMotionKey}
                />;
            break; 
        case 'tahapKetiga':
            konten = 
                <SubFormSuratArahanTahapKetiga
                    control={control}
                    setValue={setValue}
                    handleSubmit={handleSubmit}
                    setIsLoading={setIsLoading}
                    setError={setError}
                    setMotionKey={setMotionKey}
                />;
            break; 
        default:
            konten = null;
            break;
    }
    return konten;
};

