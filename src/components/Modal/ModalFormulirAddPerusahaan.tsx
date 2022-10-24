import { ContextualMenu, FontSizes, FontWeights, getTheme, IconButton, IDragOptions, IIconProps, ILabelStyles, IProgressIndicatorStyles, Label, mergeStyleSets, Modal, PrimaryButton, Stack } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Control, useForm, UseFormSetValue, useWatch } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { useGetAllModelPerizinanQuery } from "../../features/perusahaan/model-perizinan-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { useGetAllSkalaUsahaQuery } from "../../features/perusahaan/skala-usaha";
import { HookFormAnimProps } from "../../app/HookFormProps";
import { useGetAllKategoriPelakuUsahaBySkalaUsahaQuery, useGetPelakuUsahaByKategoriPelakuUsahaQuery } from "../../features/perusahaan/pelaku-usaha-api-slice";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";


interface IStateFormulirAddPerusahaanAnimationFramer {
    animModelPerizinan: string;
    flipDisplayModelPerizinan: boolean;
    animSkalaUsaha: string;
    flipDisplaySkalaUsaha: boolean;
    animPelakuUsaha: string;
    flipDisplayPelakuUsaha: boolean;
    animDetailPerusahaanOSS: string;
    flipDisplayDetailPerusahaanOSS: boolean;
    animDetailPerusahaanNonOSS: string;
    flipDisplayDetailPerusahaanNonOSS: boolean;    
};
const duration: number = 0.5;
const variantModelPerizinan = {
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
const variantSkalaUsaha = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
        transition: {
            duration
        },
    },
};
const variantPelakuUsaha = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
        transition: {
            duration
        },
    },
};
const variantDetailPerusahaanOSS = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
        transition: {
            duration
        },
    },
};
const variantDetailPerusahaanNonOSS = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
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
    children?: ReactNode;
};

export const ModalFormulirAddPerusahaan: FC<IModalFormulirPerusahaanProps> = ({isModalOpen, hideModal, children}) => {    
    //* local state *   
    const [motionKey, setMotionKey] = useState<string>('modelPerizinan')
    //- digunakan untuk merubah animasi transisi setiap terjadi pergantian Form - 
    // const [variant, setVariant] = useState<IStateFormulirAddPerusahaanAnimationFramer>({
    //     animModelPerizinan: 'open',
    //     flipDisplayModelPerizinan: true,
    //     animSkalaUsaha: 'close',
    //     flipDisplaySkalaUsaha: false,
    //     animPelakuUsaha: 'close',
    //     flipDisplayPelakuUsaha: false,
    //     animDetailPerusahaanOSS: 'closed',
    //     flipDisplayDetailPerusahaanOSS: false,
    //     animDetailPerusahaanNonOSS: 'closed',
    //     flipDisplayDetailPerusahaanNonOSS: false,
    // });  
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(true);
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
                propinsi: defaultPropinsi,
                kabupaten: defaultKabupaten,
                kecamatan: defaultKecamatan,
                desa: defaultDesa,
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
                })
            }             
        </Modal>
    );
};

interface ISlideSubFormPerusahaanParam {
    motionKey: string;
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    control: Control<IPerusahaan, Object>;
    setValue: UseFormSetValue<IPerusahaan>;
};

const getSlideSubFormPerusahaan = (
    {motionKey, setMotionKey, control, setValue}: ISlideSubFormPerusahaanParam) => {
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
        // case 'plp':
        //     // konten = <KontenPelaporanPemrakarsa />;   
        //     break;
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
export const FormModelPerizinan: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {  
    const [animModelPerizinan, setAnimModelPerizinan] = useState<string>('open');
    // const variantModelPerizinan = {
    //     open: { 
    //         opacity: 1, 
    //         x: 0,      
    //         transition: {
    //             duration
    //         },   
    //     },
    //     closed: { 
    //         opacity: 0, 
    //         x: '-10%', 
    //         transition: {
    //             duration
    //         },
    //     },
    // };

    // const [modelPerizinan] = useWatch({
    //     control: props.control, 
    //     name: ['modelPerizinan']
    // });
    //rtk query modelperizinan variable hook
    const { data: dataModelPerizinan = [], isFetching: isFetchingModelPerizinan } = useGetAllModelPerizinanQuery();
    const dataModelPerizinanOptions = dataModelPerizinan.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
    const [modelPerizinan] = useWatch({
        control: control, 
        name: ['modelPerizinan']
    });

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
            variants={variantModelPerizinan}
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
                        options={dataModelPerizinanOptions}
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
    //rtk query modelperizinan variable hook
    const { data: dataSkalaUsaha = [], isFetching: isFetchingSkalaUsaha } = useGetAllSkalaUsahaQuery();
    const dataSkalaUsahaOptions = dataSkalaUsaha.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
    const [modelPerizinan, skalaUsaha] = useWatch({
        control: control, 
        name: ['modelPerizinan', 'skalaUsaha']
    });

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
            // props.setVariant((prev: IStateFormulirAddPerusahaanAnimationFramer) =>({...prev, animSkalaUsaha: 'closed'}));
            // let timer = setTimeout(
            //     () => {
            // //         props.changeHightContainer(570);
            //         props.setVariant(
            //             (prev: IStateFormulirAddPerusahaanAnimationFramer) => (
            //                 {...prev, flipDisplaySkalaUsaha: false, flipDisplayPelakuUsaha: true, animPelakuUsaha: 'open'}
            //             )
            //         );
            //     },
            //     duration*1000
            // );

            // return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div 
            animate={animSkalaUsaha}
            variants={variantSkalaUsaha}
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
                        options={dataSkalaUsahaOptions}
                        required
                        name="skalaUsaha"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleSetSkalaUsaha}
                        control={control}
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
interface IFormKategoriPelakuUsahaProps extends HookFormAnimProps {
    control?: Control<any>;
    setValue?: any;
};

const FormPelakuUsaha: FC<IFormKategoriPelakuUsahaProps> = (props) => {
    const [skalaUsaha, pelakuUsaha, modelPerizinan] = useWatch({
        control: props.control, 
        name: ['skalaUsaha', 'pelakuUsaha', 'modelPerizinan']
    });
    const { data: dataKategoriPelakuUsaha = [], isFetching: isFetchingKategoriPelakuUsaha } = useGetAllKategoriPelakuUsahaBySkalaUsahaQuery(skalaUsaha);
    const dataKategoriPelakuUsahaOptions = dataKategoriPelakuUsaha.map((t) => { return {key: t.id as string, text: `${t.nama}` as string}; });

    const processBackToPreviousStep = useCallback(
        () => {
            props.setVariant(
                (prev: IStateFormulirAddPerusahaanAnimationFramer) => ({...prev, animPelakuUsaha: 'closed'})
            );

            let timer = setTimeout(
                () => {
                    // props.changeHightContainer(300);
                    props.setVariant(
                        (prev: IStateFormulirAddPerusahaanAnimationFramer) => ({
                            ...prev,                             
                            animSkalaUsaha: 'open',
                            flipDisplayPelakuUsaha: false, 
                            flipDisplaySkalaUsaha: true, 
                        })
                    );
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
            props.setValue("pelakuUsaha", {...pelakuUsaha, kategoriPelakuUsaha: itemKategoriPelakuUsahaSelected});
        },
        [dataKategoriPelakuUsaha, pelakuUsaha]
    );

    const processNextStep = useCallback(
        () => {
            if(modelPerizinan.id == '1') {  //oss
                props.setVariant((prev: IStateFormulirAddPerusahaanAnimationFramer) =>({...prev, animPelakuUsaha: 'closed'}));

                let timer = setTimeout(
                    () => {
                        props.setVariant(
                            (prev: IStateFormulirAddPerusahaanAnimationFramer) => (
                                {...prev, flipDisplayPelakuUsaha: false, flipDisplayDetailPerusahaanOSS: true, animDetailPerusahaanOSS: 'open'}
                            )
                        );
                    },
                    duration*1000
                );
                return () => clearTimeout(timer);
            }
            else {  //non oss
                props.setVariant((prev: IStateFormulirAddPerusahaanAnimationFramer) =>({...prev, animPelakuUsaha: 'closed'}));

                let timer = setTimeout(
                    () => {
                        props.setVariant(
                            (prev: IStateFormulirAddPerusahaanAnimationFramer) => (
                                {...prev, flipDisplayPelakuUsaha: false, flipDisplayDetailPerusahaanNonOSS: true, animDetailPerusahaanNonOSS: 'open'}
                            )
                        );
                    },
                    duration*1000
                );
                return () => clearTimeout(timer);
            }            
        },
        [modelPerizinan]
    );

    return (
        <motion.div
            animate={props.variant.animPelakuUsaha}
            variants={variantPelakuUsaha}
            style={props.variant.flipDisplayPelakuUsaha?{display:'block'}:{display:'none'}}
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
                        options={dataKategoriPelakuUsahaOptions}
                        required
                        name="jenisPelakuUsaha"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleSetJenisPelakuUsaha}
                        control={props.control}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={processNextStep}
                />
            </Stack>   
        </motion.div>
    );
};
/*-------------------------------------------Data Detail Perusahaan---------------------------------------------------------------*/
interface IFormDetailPerusahaanOSS extends HookFormAnimProps {
    control?: Control<any>;
    setValue?: any;
};

const FormDetailPerusahaanOSS: FC<IFormDetailPerusahaanOSS> = (props) => {
    const [pelakuUsaha] = useWatch({
        control: props.control, 
        name: ['pelakuUsaha']
    });

    const { data: dataPelakuUsaha = [], isFetching: isFetchingPelakuUsaha } = useGetPelakuUsahaByKategoriPelakuUsahaQuery(pelakuUsaha.kategoriPelakuUsaha, {skip: pelakuUsaha.kategoriPelakuUsaha == null ? true : false});
    const dataPelakuUsahaOptions = dataPelakuUsaha.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
    
    useEffect(
        () => {

        },
        [dataPelakuUsaha]
    );

    const processBackToPreviousStep = useCallback(
        () => {
            props.setVariant(
                (prev: IStateFormulirAddPerusahaanAnimationFramer) => ({...prev, animDetailPerusahaanOSS: 'closed'})
            );

            let timer = setTimeout(
                () => {
                    // props.changeHightContainer(300);
                    props.setVariant(
                        (prev: IStateFormulirAddPerusahaanAnimationFramer) => ({
                            ...prev,                             
                            animPelakuUsaha: 'open',
                            flipDisplayDetailPerusahaanOSS: false, 
                            flipDisplayPelakuUsaha: true, 
                        })
                    );
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div
            animate={props.variant.animDetailPerusahaanOSS}
            variants={variantDetailPerusahaanOSS}
            style={props.variant.flipDisplayDetailPerusahaanOSS?{display:'block'}:{display:'none'}}
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
                <Label styles={labelStyle}>Data Perusahaan</Label>
                <Label styles={subLabelStyle}>Isikan detail data perusahaan sesuai dengan data OSS-RBA.</Label>
            </Stack>
            <Stack>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label={`Jenis ${pelakuUsaha.kategoriPelakuUsaha != null ? pelakuUsaha.kategoriPelakuUsaha.nama:null}`}
                        placeholder="Silahkan pilih "
                        options={dataPelakuUsahaOptions}
                        required
                        name="jenisPelakuUsaha"
                        rules={{ required: "harus diisi" }} 
                        control={props.control}
                    /> 
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField 
                        label="Nama"
                        name="nama"
                        control={props.control}
                    />
                </Stack.Item>
            </Stack>
        </motion.div>
    );
};
/*-----------------------------------------------------------------------------------------------------------*/
