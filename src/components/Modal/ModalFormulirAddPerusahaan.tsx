import { FontSizes, FontWeights, getTheme, IconButton, IProgressIndicatorStyles, mergeStyleSets, Modal, ProgressIndicator } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { FormAlamatPerusahaan } from "../FormulirPerusahaanFormHook/FormAlamatPerusahaan";
import { FormIdentitasPerusahaan } from "../FormulirPerusahaanFormHook/FormIdentitasPerusahaan";
import { FormNpwpPerusahaan } from "../FormulirPerusahaanFormHook/FormNpwpPerusahaan";
import { FormPelakuUsaha } from "../FormulirPerusahaanFormHook/FormPelakuUsaha";
import { FormSkalaUsaha } from "../FormulirPerusahaanFormHook/FormSkalaUsaha";
import { FormModelPerizinanPerusahaan } from "../FormulirPerusahaanFormHook/FormModelPerizinanPerusahaan";
import { cancelIcon, dragOptions, IModalFormulirPerusahaanProps, ISlideSubFormPerusahaanParam } from "../FormulirPerusahaanFormHook/InterfacesPerusahaan";
import { FormKontakPerusahaan } from "../FormulirPerusahaanFormHook/FormKontakPerusahaan";

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
const progressStyle: IProgressIndicatorStyles ={
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

export const ModalFormulirAddPerusahaan: FC<IModalFormulirPerusahaanProps> = ({isModalOpen, hideModal, isDraggable}) => {  
    //* local state *   
    const [motionKey, setMotionKey] = useState<string>('modelPerizinan');    
    // const [isErrorConnection, setIsErrorConnection] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    console.log(isLoading);
    const titleId = useId('Formulir Perusahaan');
    //hook variable form hook
    const { control, handleSubmit, setValue, reset, setError } = useForm<IPerusahaan>({
        mode: 'onSubmit',
        defaultValues: {
            id: '',
            nama: '',
            modelPerizinan: {
                id: '',
                nama: '',
                singkatan: ''
            },
            skalaUsaha: {
                id: '',
                nama: '',
                singkatan:''
            },
            pelakuUsaha: {
                id: '',
                nama: '',
                singkatan:'',
                kategoriPelakuUsaha: null
            },
            alamat: {
                propinsi: null,
                kabupaten: null,
                kecamatan: null,
                desa: null,
                keterangan: '',
            },
            kontak: {
                telepone: '',
                fax: '',
                email: '',
            }
        }
    });
    
    const handleCloseModal = useCallback(
        () => {
            reset();
            setMotionKey('modelPerizinan');
            hideModal();
        },
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
                    <span id={titleId}>Formulir Perusahaan</span>
                    <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={handleCloseModal}
                    />
                </div>                  
            </div>
            {                
                getSlideSubFormPerusahaan({
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
        </Modal>
    );
};

const getSlideSubFormPerusahaan = (
    {motionKey, setMotionKey, control, setValue, handleSubmit, setError, setIsLoading}: ISlideSubFormPerusahaanParam) => {
    let konten = null;
    switch (motionKey) {
        case 'modelPerizinan':
            konten = 
                <FormModelPerizinanPerusahaan
                    control={control}
                    setValue={setValue}
                    setMotionKey={setMotionKey}
                />;
            break; 
        case 'skalaUsaha':
            konten = 
                <FormSkalaUsaha
                    control={control}
                    setValue={setValue}
                    setMotionKey={setMotionKey}
                />;   
            break;
        case 'pelakuUsaha':
            konten = 
            <FormPelakuUsaha
                control={control}
                setValue={setValue}
                setMotionKey={setMotionKey}
            />;   
            break;
        case 'npwpPerusahaan':
            konten = 
            <FormNpwpPerusahaan
                control={control}
                setValue={setValue}
                setError={setError}
                setMotionKey={setMotionKey}
                handleSubmit={handleSubmit}
                setIsLoading={setIsLoading}
            />;   
            break;  
        case 'identitasPerusahaan':
            konten = 
            <FormIdentitasPerusahaan
                control={control}
                setValue={setValue}
                setMotionKey={setMotionKey}
            />;   
            break; 
        case 'alamatPerusahaan':
            konten = 
            <FormAlamatPerusahaan
                control={control}
                setValue={setValue}
                setMotionKey={setMotionKey}
            />;   
            break;   
        case 'kontakPerusahaan':
            konten = 
            <FormKontakPerusahaan
                control={control}
                setValue={setValue}
                setError={setError}
                setMotionKey={setMotionKey}
                handleSubmit={handleSubmit}
            />;   
            break;   
        default:
            konten = null;
            break;
    }
    return konten;
};