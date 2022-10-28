import { ContextualMenu, FontSizes, FontWeights, getTheme, IconButton, IDragOptions, IDropdownOption, IIconProps, ILabelStyles, IProgressIndicatorStyles, Label, MaskedTextField, mergeStyleSets, Modal, PrimaryButton, Stack } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Control, SubmitHandler, useForm, UseFormHandleSubmit, UseFormSetValue, useWatch } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { useGetAllModelPerizinanQuery } from "../../features/perusahaan/model-perizinan-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { useGetAllSkalaUsahaQuery } from "../../features/perusahaan/skala-usaha";
import { HookFormAnimProps } from "../../app/HookFormProps";
import { useGetAllKategoriPelakuUsahaBySkalaUsahaQuery, useGetPelakuUsahaByKategoriPelakuUsahaQuery } from "../../features/perusahaan/pelaku-usaha-api-slice";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { IUploadMode, UploadFilesFluentUi } from "../UploadFiles/UploadFilesFluentUI";
import { ControlledFluentUiMaskTextField } from "../ControlledTextField/ControlledFluentUiMaskTextField";


const duration: number = 0.5;
const variantAnimPerusahaan = {
    open: { 
        opacity: 1, 
        x: 0,      
        transition: {
            duration
        },   
    },
    closed: { 
        opacity: 0, 
        x: '-10%', 
        transition: {
            duration
        },
    },
};
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
          flex: '1 1 auto',
          borderTop: `4px solid ${theme.palette.themePrimary}`,
          color: theme.palette.neutralPrimary,
          display: 'flex',
          alignItems: 'center',
          fontWeight: FontWeights.semibold,
          fontSize: FontSizes.large,
          padding: '12px 12px 14px 24px',
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
    }
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
        // width: 464,
        // marginLeft: 'auto',
        // marginRight: 'auto',
        // height: 8,
        flex: '1 1 auto',
    },
    itemName: null,
    itemDescription: null,
    itemProgress: null,
    progressBar: {
        background: '#ff6300'
    },
    progressTrack: null,
};
const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };
/*-----------------------------------------Modal Container--------------------------------------------------------------*/
interface IModalFormulirPerusahaanProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};

export const ModalFormulirAddPerusahaan: FC<IModalFormulirPerusahaanProps> = ({isModalOpen, hideModal, isDraggable}) => {  
    //* local state *   
    const [motionKey, setMotionKey] = useState<string>('modelPerizinan');    
    // const [isErrorConnection, setIsErrorConnection] = useState<boolean>(false);
    // const [isLoading, setIsLoading] = useState<boolean>(false); 
    const titleId = useId('Formulir Perusahaan');
    const { control, handleSubmit, setValue, reset } = useForm<IPerusahaan>({
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
            kontakPerusahaan: null
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
                <span id={titleId}>Tambah Perusahaan</span>
                <IconButton
                    styles={iconButtonStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close popup modal"
                    onClick={handleCloseModal}
                />
            </div>
            {                
                getSlideSubFormPerusahaan({
                    motionKey, 
                    setMotionKey,
                    control, 
                    setValue,
                    handleSubmit,
                })
            }             
        </Modal>
    );
};
/*******************************************helper function**************************************************************/
interface ISlideSubFormPerusahaanParam {
    motionKey: string;
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    control: Control<IPerusahaan, Object>;
    setValue: UseFormSetValue<IPerusahaan>;
    handleSubmit: UseFormHandleSubmit<IPerusahaan>;
};

const getSlideSubFormPerusahaan = (
    {motionKey, setMotionKey, control, setValue, handleSubmit}: ISlideSubFormPerusahaanParam) => {
    let konten = null;
    switch (motionKey) {
        case 'modelPerizinan':
            konten = 
                <FormModelPerizinan
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
        case 'detailPerusahaanOSS':
            konten = 
            <FormNpwpPerusahaanOSS
                control={control}
                setValue={setValue}
                setMotionKey={setMotionKey}
                handleSubmit={handleSubmit}
            />;   
            break;            
        default:
            konten = 
            <FormModelPerizinan
                control={control}
                setValue={setValue}
                setMotionKey={setMotionKey}
            />;
            break;
    }
    return konten;
};
/*-------------------------------------------Model Perizinan------------------------------------------------------------*/
const stackTokens = { childrenGap: 2 };
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};
const subLabelStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       color: '#383838',
       fontSize: '1rem', 
    }
};
interface ISubFormPerusahaanProps extends HookFormAnimProps {
    control?: Control<any>;
    setValue: UseFormSetValue<IPerusahaan>;
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
};

const FormModelPerizinan: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {  
    const [animModelPerizinan, setAnimModelPerizinan] = useState<string>('open');
    const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    //hook variable from react form hook state variable
    const [modelPerizinan] = useWatch({
        control: control, 
        name: ['modelPerizinan']
    });
    //rtk query modelperizinan variable hook
    const { data: dataModelPerizinan = [], isFetching: isFetchingModelPerizinan } = useGetAllModelPerizinanQuery();    
    
    useEffect(
        () => {
            if(isFetchingModelPerizinan == false) {
                let tmpOptions = dataModelPerizinan.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
                setOptions(tmpOptions);
            }
        },
        [isFetchingModelPerizinan, dataModelPerizinan]
    );

    const processNextStep = useCallback(
        () => {
            setAnimModelPerizinan('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('skalaUsaha');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetModelPerizinan = useCallback(
        (itemSelected) => {
            
            let itemModelPerizinanSelected = dataModelPerizinan.find(
                (item) => { return item.id == itemSelected.key; } 
            );
            setValue("modelPerizinan", itemModelPerizinanSelected!);
        },
        [dataModelPerizinan]
    )

    return (
        <motion.div 
            animate={animModelPerizinan}
            variants={variantAnimPerusahaan}
            className={contentStyles.body} 
        >
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Status OSS-RBA?</Label>
                <Label styles={subLabelStyle}>Status OSS-RBA perusahaan menentukan isian tahab berikutnya.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Status OSS-RBA"
                        placeholder="Pilih status OSS-RBA"
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
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}       
                    disabled={modelPerizinan.id == ''? true:false} 
                />
            </Stack>   
        </motion.div>
    );
};
/*-------------------------------------------Skala Usaha-------------------------------------------------------------*/
const backIcon: IIconProps = { 
    iconName: 'Back',
    style: {
        color: 'grey',
        fontSize: '0.8rem',
    }
};
const labelTitleBack: ILabelStyles  = {
    root: {
       fontWeight: 400,
       fontSize: '1rem', 
    }
};
const FormSkalaUsaha: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {
    const [animSkalaUsaha, setAnimSkalaUsaha] = useState<string>('open');
    const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    //rtk query modelperizinan variable hook
    const { data: dataSkalaUsaha = [], isFetching: isFetchingSkalaUsaha } = useGetAllSkalaUsahaQuery();
    //hook variable from form hook
    const [modelPerizinan, skalaUsaha] = useWatch({
        control: control, 
        name: ['modelPerizinan', 'skalaUsaha']
    });

    useEffect(
        () => {
            if(isFetchingSkalaUsaha == false) {
                let tmpOptions = dataSkalaUsaha.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
                setOptions(tmpOptions);
            }
        },
        [isFetchingSkalaUsaha, dataSkalaUsaha]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimSkalaUsaha('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('modelPerizinan');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetSkalaUsaha = useCallback(
        (itemSelected) => {
            let itemSkalaUsahaSelected = dataSkalaUsaha.find(
                (item) => { return item.id == itemSelected.key; } 
            )
            setValue("skalaUsaha", itemSkalaUsahaSelected || null);
        },
        [dataSkalaUsaha]
    );

    const processNextStep = useCallback(
        () => {
            setAnimSkalaUsaha('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('pelakuUsaha');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div 
            animate={animSkalaUsaha}
            variants={variantAnimPerusahaan}
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
                    {
                        modelPerizinan != null ? `Status OSS-RBA : ${modelPerizinan!.singkatan}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Skala Usaha</Label>
                <Label styles={subLabelStyle}>Skala usaha harus sesuai dengan skala usaha pada OSS-RBA.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Skala Usaha"
                        placeholder="Pilih skala usaha"
                        options={options}
                        required
                        name="skalaUsaha"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleSetSkalaUsaha}
                        control={control}
                        selectedKey={skalaUsaha.id != '' ? skalaUsaha.id : undefined}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={processNextStep}
                    disabled={skalaUsaha.id == ''? true:false}
                />
            </Stack>   
        </motion.div >
    );
};
/*-------------------------------------------Pelaku Usaha--------------------------------------------------------------*/
const FormPelakuUsaha: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {
    //local state
    const [animKategoriPelakuUsaha, setAnimKategoriPelakuUsaha] = useState<string>('open'); 
    const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    //hook variable from react form hook state variable   
    const [skalaUsaha, pelakuUsaha] = useWatch({
        control: control, 
        name: ['skalaUsaha', 'pelakuUsaha']
    });
    const { data: dataKategoriPelakuUsaha = [], isFetching: isFetchingKategoriPelakuUsaha } = useGetAllKategoriPelakuUsahaBySkalaUsahaQuery(skalaUsaha);

    useEffect(
        () => {
            if(isFetchingKategoriPelakuUsaha == false) {
                let tmpOptions = dataKategoriPelakuUsaha.map((t) => { return {key: t.id as string, text: t.nama as string}; });
                setOptions(tmpOptions);
            }
        },
        [isFetchingKategoriPelakuUsaha, dataKategoriPelakuUsaha]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimKategoriPelakuUsaha('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('skalaUsaha');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetJenisPelakuUsaha = useCallback(
        (itemSelected) => {
            let itemKategoriPelakuUsahaSelected = dataKategoriPelakuUsaha.find(
                (item) => { return item.id == itemSelected.key; } 
            )
            setValue("pelakuUsaha", {...pelakuUsaha, kategoriPelakuUsaha: itemKategoriPelakuUsahaSelected});
        },
        [dataKategoriPelakuUsaha, pelakuUsaha]
    );

    const processNextStep = useCallback(
        () => {
            setAnimKategoriPelakuUsaha('closed');
            let timer = setTimeout(
                () => {
                    setMotionKey('detailPerusahaanOSS');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div
            animate={animKategoriPelakuUsaha}
            variants={variantAnimPerusahaan}
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
                    {
                        skalaUsaha != null ? `Skala usaha - ${skalaUsaha!.singkatan}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Jenis Pelaku Usaha</Label>
                <Label styles={subLabelStyle}>Jenis pelaku usaha harus sesuai dengan data pada OSS-RBA.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Jenis pelaku usaha"
                        placeholder="Pilih jenis pelaku usaha"
                        options={options}
                        required
                        name="pelakuUsaha"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleSetJenisPelakuUsaha}
                        control={control}
                        selectedKey={pelakuUsaha.kategoriPelakuUsaha != null ? pelakuUsaha.kategoriPelakuUsaha.id : undefined}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={processNextStep}
                    disabled={pelakuUsaha.kategoriPelakuUsaha == null? true:false}
                />
            </Stack>   
        </motion.div>
    );
};
/*-------------------------------------------Data Detail Perusahaan---------------------------------------------------------------*/
interface ISubFormNpwpPerusahaanProps extends ISubFormPerusahaanProps {
    handleSubmit: UseFormHandleSubmit<IPerusahaan>;
};
const FormNpwpPerusahaanOSS: FC<ISubFormNpwpPerusahaanProps> = ({control, setValue, setMotionKey, handleSubmit}) => {    
    //local state
    const [animDetailPerusahaan, setAnimDetailPerusahaan] = useState<string>('open');
    const [options, setOptions] = useState<IDropdownOption<any>[]>([]);
    //hook variable from react form hook state variable
    const [id, pelakuUsaha] = useWatch({
        control: control, 
        name: ['id', 'pelakuUsaha']
    }); 
    //rtk query hook variable     
    const { data: dataPelakuUsaha = [], isFetching: isFetchingPelakuUsaha } = useGetPelakuUsahaByKategoriPelakuUsahaQuery(pelakuUsaha.kategoriPelakuUsaha, {skip: pelakuUsaha.kategoriPelakuUsaha == null ? true : false});

    useEffect(
        () => {
            if(isFetchingPelakuUsaha == false) {
                let tmpOptions = dataPelakuUsaha.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
                setOptions(tmpOptions);
            }
        },
        [isFetchingPelakuUsaha, dataPelakuUsaha]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimDetailPerusahaan('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('pelakuUsaha');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const handleSetPelakuUsaha = useCallback(
        (itemSelected) => {
            let itemPelakuUsahaSelected = dataPelakuUsaha.find(
                (item) => { return item.id == itemSelected.key; } 
            )
            setValue("pelakuUsaha", {...pelakuUsaha, id: itemPelakuUsahaSelected!.id, nama: itemPelakuUsahaSelected!.nama, singkatan: itemPelakuUsahaSelected!.singkatan});
        },
        [dataPelakuUsaha, pelakuUsaha]
    );

    const save: SubmitHandler<IPerusahaan> = useCallback(
        async(data) => {
            console.log(data);
        },
        []
    );    

    // const processNextStep = useCallback(
    //     () => {
    //         // setAnimKategoriPelakuUsaha('closed');
    //         // let timer = setTimeout(
    //         //     () => {
    //         //         setMotionKey('detailPerusahaanOSS');
    //         //     },
    //         //     duration*1000
    //         // );
    //         // return () => clearTimeout(timer);
    //     },
    //     []
    // );

    return (
        <motion.div
            animate={animDetailPerusahaan}
            variants={variantAnimPerusahaan}
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
                    {
                        pelakuUsaha.kategoriPelakuUsaha != null ? `Jenis pelaku usaha - ${pelakuUsaha.kategoriPelakuUsaha.nama}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>
                    {`NPWP ${(pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? 'Pribadi':'Badan'}`}
                </Label>
                <Label styles={subLabelStyle}>Isikan data npwp perusahaan sesuai dengan data OSS-RBA.</Label>
            </Stack>
            <Stack tokens={stackTokens}>                
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label={`Jenis ${pelakuUsaha.kategoriPelakuUsaha != null ? pelakuUsaha.kategoriPelakuUsaha.nama:null}`}
                        placeholder="Silahkan pilih "
                        options={options}
                        required
                        name="pelakuUsaha"
                        rules={{ required: "harus diisi" }} 
                        control={control}
                        onChangeItem={handleSetPelakuUsaha}
                        selectedKey={pelakuUsaha.id != null ? pelakuUsaha.id : undefined}
                        disabled={
                            (pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? true:false
                        }
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiMaskTextField 
                        name="id"
                        label={`NPWP ${(pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? 'Pribadi':'Badan'}`}
                        mask="99.999.999.9-999.999" 
                        control={control}
                        disabled={
                            (pelakuUsaha.kategoriPelakuUsaha.id ==  '0101' || pelakuUsaha.kategoriPelakuUsaha.id ==  '0201') ? false:(pelakuUsaha.id == '' ? true:false)
                        }
                    />
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'right'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={handleSubmit(save)}
                    disabled={id == '' ? true: false}
                />
            </Stack>
        </motion.div>
    );
};
/*-----------------------------------------------------------------------------------------------------------*/
