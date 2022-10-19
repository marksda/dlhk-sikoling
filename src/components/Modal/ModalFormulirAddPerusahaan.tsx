import { ContextualMenu, FontSizes, FontWeights, getTheme, IconButton, IDragOptions, IIconProps, ILabelStyles, IProgressIndicatorStyles, Label, mergeStyleSets, Modal, PrimaryButton, ProgressIndicator, Stack } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Control, useForm } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { useGetAllModelPerizinanQuery } from "../../features/perusahaan/model-perizinan-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";


interface IStateFormulirAddPerusahaanAnimationFramer {
    animModelPerizinan: string;
    flipDisplayModelPerizinan: boolean;
};

const duration: number = 0.5;
const variantsModelPerizinan = {
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

interface IFormulirPerusahaanProps {
    isModalOpen: boolean;
    hideModal: () => void
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

export const ModalFormulirAddPerusahaan: FC<IFormulirPerusahaanProps> = (props) => {  
    //* local state *   
    //- digunakan untuk merubah animasi transisi setiap terjadi pergantian Form - 
    const [variant, setVariant] = useState<IStateFormulirAddPerusahaanAnimationFramer>({
        animModelPerizinan: 'open',
        flipDisplayModelPerizinan: true,
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
            skalaUsaha: null,
            pelakuUsaha: null,
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
            />
            {
            isLoading && (
                <ProgressIndicator styles={progressStyle}/>)
            }  
        </Modal>
    );
};

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
interface IFormModelPerizinanProps {
    variant?: any;
    setVariant?: any;
    control?: Control<any>;
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
                            {...prev, flipDisplayModelPerizinan: false, flipDisplayPID2: true, animPID2: 'open'}
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
        <motion.div className={contentStyles.body}>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Status OSS-RBA?</Label>
                <Label styles={subLabelStyle}>Kami perlu mengetahui status OSS atau NON OSS perusahaan, untuk menentukan isian tahab berikutnya.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiDropDown
                        label="Status OSS"
                        placeholder="Pilih status OSS"
                        options={dataModelPerizinanOptions}
                        required
                        name="modelPerizinan"
                        rules={{ required: "harus diisi" }} 
                        control={props.control}
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
}