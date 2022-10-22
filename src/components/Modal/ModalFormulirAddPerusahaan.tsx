import { ContextualMenu, FontSizes, FontWeights, getTheme, IconButton, IDragOptions, IIconProps, ILabelStyles, IProgressIndicatorStyles, Label, mergeStyleSets, Modal, PrimaryButton, ProgressIndicator, Stack } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Control, useForm, useWatch } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { useGetAllModelPerizinanQuery } from "../../features/perusahaan/model-perizinan-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ISkalaUsaha, useGetAllSkalaUsahaQuery } from "../../features/perusahaan/skala-usaha";
import { HookFormAnimProps } from "../../app/HookFormProps";
import { useGetAllKategoriPelakuUsahaBySkalaUsahaQuery } from "../../features/perusahaan/pelaku-usaha-api-slice";


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

/*-------------------------------------------------------------------------------------------------------*/
interface IModalFormulirPerusahaanProps {
    isModalOpen: boolean;
    hideModal: () => void
};
export const ModalFormulirAddPerusahaan: FC<IModalFormulirPerusahaanProps> = (props) => {  
    //* local state *   
    //- digunakan untuk merubah animasi transisi setiap terjadi pergantian Form - 
    const [variant, setVariant] = useState<IStateFormulirAddPerusahaanAnimationFramer>({
        animModelPerizinan: 'open',
        flipDisplayModelPerizinan: true,
        animSkalaUsaha: 'close',
        flipDisplaySkalaUsaha: false,
        animPelakuUsaha: 'close',
        flipDisplayPelakuUsaha: false,
        animDetailPerusahaanOSS: 'closed',
        flipDisplayDetailPerusahaanOSS: false,
        animDetailPerusahaanNonOSS: 'closed',
        flipDisplayDetailPerusahaanNonOSS: false,
    });  
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(true);
    const [isErrorConnection, setIsErrorConnection] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    const titleId = useId('Formulir Perusahaan');
    const { control, handleSubmit, setValue } = useForm<IPerusahaan>({
        mode: 'onSubmit',
        defaultValues: {
            id: '',
            nama: '',
            modelPerizinan: null,
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
    
    return (
        <Modal
            titleAriaId={titleId}
            isOpen={props.isModalOpen}
            onDismiss={props.hideModal}
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
                    onClick={props.hideModal}
                />
            </div>
            <FormModelPerizinan
                variant={variant} 
                setVariant={setVariant}
                control={control}
                setValue={setValue}
            />
            <FormSkalaUsaha
                variant={variant} 
                setVariant={setVariant}
                control={control}
                setValue={setValue}
            />
            <FormPelakuUsaha
                variant={variant} 
                setVariant={setVariant}
                control={control}
                setValue={setValue}
            />
            {
            isLoading && (
                <ProgressIndicator styles={progressStyle}/>)
            }  
        </Modal>
    );
};
/*-------------------------------------------------------------------------------------------------------*/
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
interface IFormModelPerizinanProps extends HookFormAnimProps {
    control?: Control<any>;
    setValue?: any;
};
const FormModelPerizinan: FC<IFormModelPerizinanProps> = (props) => {  
    //rtk query modelperizinan variable hook
    const { data: dataModelPerizinan = [], isFetching: isFetchingModelPerizinan } = useGetAllModelPerizinanQuery();
    const dataModelPerizinanOptions = dataModelPerizinan.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });

    const processNextStep = useCallback(
        () => {
            props.setVariant((prev: IStateFormulirAddPerusahaanAnimationFramer) =>({...prev, animModelPerizinan: 'closed'}));
            let timer = setTimeout(
                () => {
            //         props.changeHightContainer(570);
                    props.setVariant(
                        (prev: IStateFormulirAddPerusahaanAnimationFramer) => (
                            {...prev, flipDisplayModelPerizinan: false, flipDisplaySkalaUsaha: true, animSkalaUsaha: 'open'}
                        )
                    );
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
            )
            props.setValue("modelPerizinan", itemModelPerizinanSelected);
        },
        [dataModelPerizinan]
    )

    return (
        <motion.div 
            animate={props.variant.animModelPerizinan}
            variants={variantModelPerizinan}
            style={props.variant.flipDisplayModelPerizinan?{display:'block'}:{display:'none'}}
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
                        onChangeItem={handleSetModelPerizinan}
                    /> 
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}
                    />
            </Stack>   
        </motion.div>
    );
};
/*---------------------------------------------------------------------------*/
interface IFormSkalaUsahaProps extends HookFormAnimProps {
    control?: Control<any>;
    setValue?: any;
};
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
const FormSkalaUsaha: FC<IFormSkalaUsahaProps> = (props) => {
    //rtk query modelperizinan variable hook
    const { data: dataSkalaUsaha = [], isFetching: isFetchingSkalaUsaha } = useGetAllSkalaUsahaQuery();
    const dataSkalaUsahaOptions = dataSkalaUsaha.map((t) => { return {key: t.id as string, text: `${t.nama} (${t.singkatan})` as string}; });
    const [modelPerizinan] = useWatch({
        control: props.control, 
        name: ['modelPerizinan']
    });

    const processBackToPreviousStep = useCallback(
        () => {
            props.setVariant(
                (prev: IStateFormulirAddPerusahaanAnimationFramer) => ({...prev, animSkalaUsaha: 'closed'})
            );

            let timer = setTimeout(
                () => {
                    // props.changeHightContainer(300);
                    props.setVariant(
                        (prev: IStateFormulirAddPerusahaanAnimationFramer) => ({
                            ...prev,                             
                            animModelPerizinan: 'open',
                            flipDisplaySkalaUsaha: false, 
                            flipDisplayModelPerizinan: true, 
                        })
                    );
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
            props.setValue("skalaUsaha", itemSkalaUsahaSelected);
        },
        [dataSkalaUsaha]
    );

    const processNextStep = useCallback(
        () => {
            props.setVariant((prev: IStateFormulirAddPerusahaanAnimationFramer) =>({...prev, animSkalaUsaha: 'closed'}));
            let timer = setTimeout(
                () => {
            //         props.changeHightContainer(570);
                    props.setVariant(
                        (prev: IStateFormulirAddPerusahaanAnimationFramer) => (
                            {...prev, flipDisplaySkalaUsaha: false, flipDisplayPelakuUsaha: true, animPelakuUsaha: 'open'}
                        )
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
            animate={props.variant.animSkalaUsaha}
            variants={variantSkalaUsaha}
            style={props.variant.flipDisplaySkalaUsaha?{display:'block'}:{display:'none'}}
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
                        modelPerizinan != null ? `${modelPerizinan!.nama} (${modelPerizinan!.singkatan})`:null
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
/*----------------------------------------------------------------------------*/
interface IFormKategoriPelakuUsahaProps extends HookFormAnimProps {
    control?: Control<any>;
    setValue?: any;
};

const FormPelakuUsaha: FC<IFormKategoriPelakuUsahaProps> = (props) => {
    const [skalaUsaha, pelakuUsaha, modelPerizinan] = useWatch({
        control: props.control, 
        name: ['skalaUsaha', 'pelakuUsaha', 'modelPerizinan']
    });
    const { data: dataKategoriPelakuUsaha = [], isFetching: isFetchingkategoriPelakuUsaha } = useGetAllKategoriPelakuUsahaBySkalaUsahaQuery(skalaUsaha);
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
                        skalaUsaha != null ? `${skalaUsaha!.nama}`:null
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
                        label="Jenis pelaku Usaha"
                        placeholder="Pilih jenis pelaku usaha"
                        options={dataKategoriPelakuUsahaOptions}
                        required
                        name="jenisPelakuUsaha"
                        rules={{ required: "harus diisi" }} 
                        onChangeItem={handleSetJenisPelakuUsaha}
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
/*----------------------------------------------------------------------------------*/
interface IFormDetailPerusahaanOSS extends HookFormAnimProps {
    control?: Control<any>;
    setValue?: any;
};

const FormDetailPerusahaanOSS: FC<IFormDetailPerusahaanOSS> = (props) => {
    const [pelakuUsaha] = useWatch({
        control: props.control, 
        name: ['pelakuUsaha']
    });

    return (
        <motion.div
            animate={props.variant.animDetailPerusahaanOSS}
            variants={variantDetailPerusahaanOSS}
            style={props.variant.flipDisplayDetailPerusahaanOSS?{display:'block'}:{display:'none'}}
            className={contentStyles.body} 
        >

        </motion.div>
    );
}
