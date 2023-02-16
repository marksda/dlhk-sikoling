import { 
    ContextualMenu, FontSizes, FontWeights, getTheme, IconButton, IDragOptions, IIconProps, IProgressIndicatorStyles, mergeStyleSets, Modal, PrimaryButton, ProgressIndicator, Stack } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useCallback, useState } from "react";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddRegisterDokumenMutation, useUploadFileDokumenWithSecurityMutation } from "../../features/dokumen/register-dokumen-api-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";
import { FileUpload } from "../UploadFiles/FileUpload";
import { DokumenNibSchema, FileDokumenUploadSchema } from "../../features/schema-resolver/zod-schema";
import { TemplateDokumenNib } from "../FormTemplate/template-dok-nib";

interface IModalFormulirPegawaiProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};
type FormData = z.infer<typeof DokumenNibSchema>;
type FormFileDokumenUpload = z.infer<typeof FileDokumenUploadSchema>;

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        width: 500
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
const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const stackTokens = { childrenGap: 4 };


export const ModalFormulirAddDokumenNib: FC<IModalFormulirPegawaiProps> = ({isModalOpen, hideModal, isDraggable}) => {
    //local state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const titleId = useId('Formulir Dokumen nib');    
    //react hook form variable
    const {control} = useFormContext();
    const [
        registerPerusahaan,
    ] = useWatch({
        control: control, 
        name: [
            'registerPerusahaan'
        ]
    });

    const methodNib = useForm<FormData>({
        resolver: zodResolver(DokumenNibSchema)
    });
    const {handleSubmit} = methodNib;    

    const [daftarKbli] = useWatch({
        control: methodNib.control,
        name: ['daftarKbli']
    });

    const methods = useForm<FormFileDokumenUpload>({
        resolver: zodResolver(FileDokumenUploadSchema),
    });

    const [dokumenFile] = useWatch({
        control: methods.control, 
        name: ['dokumenFile']
    });

    //rtk query perusahaan variable hook
    // const { data: listKbli, isFetching: isFetchingDataKbli, isError: isErrorKbli } = useGetKbliByKodeQuery(kodeKbli, {skip: (kodeKbli.length < 2 || kodeKbli.length > 5) ? true : false});
    //rtk query mutation addPerusahaan variable
    const [addRegisterDokumen, ] = useAddRegisterDokumenMutation();
    const [uploadFileDokumen] = useUploadFileDokumenWithSecurityMutation();
    

    const handleCloseModal = useCallback(
        () => {
            // reset();
            // setMotionKey('tahapPertama');
            hideModal();
        },
        []
    );

    const simpanDokumen = useCallback(
        handleSubmit(
            async (data) => {       
                try {
                    var regDok: Partial<IRegisterDokumen> = {
                        dokumen: {
                            ...data, id: '010301',  nama: 'NIB - OSS'
                        },
                        perusahaan: registerPerusahaan,
                    };

                    console.log(regDok, dokumenFile);
                    setIsLoading(true);
                    await addRegisterDokumen(regDok).unwrap().then(
                        async (payload) => {
                            var formData = new FormData();
                            formData.append('file', dokumenFile);
                            await uploadFileDokumen({
                                idRegisterDokumen: payload.id as string,
                                npwpPerusahaan: payload.perusahaan?.perusahaan!.id as string,
                                idRegisterPerusahaan: payload.perusahaan?.id as string,
                                formData: formData
                            });
                            hideModal();
                        }
                    );
                    setIsLoading(false);
                } catch (error) {
                    //terjadi kegagalan
                    setIsLoading(false);
                } 
            }
        ),
        [registerPerusahaan, dokumenFile]
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
                    <span id={titleId}>Formulir Dokumen Nib OSS</span>
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
                    <FormProvider {...methodNib}>
                        <TemplateDokumenNib isLoading={isLoading}/>
                    </FormProvider>    
                    <Stack.Item>
                        <FormProvider {...methods}>
                            <FileUpload 
                                limit={1} 
                                multiple={false} 
                                name='dokumenFile' 
                                mime='application/pdf' 
                                disabled={daftarKbli?.length > 0 ? false:true}/>
                        </FormProvider>  
                    </Stack.Item>
                    <Stack.Item align="end">
                        <PrimaryButton 
                            style={{marginTop: 16, width: 100}}
                            text="Simpan" 
                            onClick={simpanDokumen}
                            disabled={(dokumenFile == undefined)||isLoading ? true:false}
                        />
                    </Stack.Item>  
                </Stack> 
            </div>               
        </Modal>
    );
};