import { 
    ComboBox, ContextualMenu, DatePicker, DayOfWeek, DefaultPalette, FontSizes, FontWeights, 
    getTheme, IComboBox, IComboBoxOption, IconButton, IDragOptions, IDropdownOption, IIconProps, 
    IProgressIndicatorStyles, IStackItemStyles, MaskedTextField, mergeStyleSets, Modal, PrimaryButton, 
    ProgressIndicator, Stack } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import cloneDeep from "lodash.clonedeep";
import find from "lodash.find";
import omit from "lodash.omit";
import remove from "lodash.remove";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { object, z, array, TypeOf } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from "../../app/hooks";
import { DayPickerIndonesiaStrings, onFormatDate, onFormatDateUtc } from "../../features/config/config";
import { IDokumenNibOss } from "../../features/dokumen/dokumen-nib-oss-slice";
import { useGetKbliByKodeQuery } from "../../features/dokumen/kbli-api-slice";
import { IKbli } from "../../features/dokumen/kbli-slice";
import { useAddRegisterDokumenMutation, useUploadFileDokumenWithSecurityMutation } from "../../features/dokumen/register-dokumen-api-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";
import { IRegisterKbli } from "../../features/dokumen/register-kbli-slice";
import { DataListKbliFluentUI } from "../DataList/DataListKBLIFluentUI";
import { FileUpload } from "../UploadFiles/FileUpload";
import { IContainerUploadStyle } from "../UploadFiles/UploadFilesFluentUI";
import { DokumenNibSchema } from "../../features/schema-resolver/zod-schema";
import { TemplateDokumenNib } from "../FormTemplate/template-dok-nib";

interface IModalFormulirPegawaiProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};

type FormData = z.infer<typeof DokumenNibSchema>;

const dokumenUploadSchema = object({
    dokumen: z.instanceof(File),
    dokumens: array(z.instanceof(File))
});
type IDokumenUpload = TypeOf<typeof dokumenUploadSchema>;

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
const stackItemStyles: IStackItemStyles = {
    root: {
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 4,
    },
};
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
const stackHorTokens = { childrenGap: 8 };
const containerStyle: IContainerUploadStyle = {
    width: 300, 
    height: 100, 
    backgroundColor: '#ECECEC',
};

export const ModalFormulirAddDokumenNib: FC<IModalFormulirPegawaiProps> = ({isModalOpen, hideModal, isDraggable}) => {
    const registerPerusahaan = useAppSelector((state) => state.registerPerusahaan);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [kodeKbli, setKodeKbli] = useState<string>('01');
    const titleId = useId('Formulir Dokumen nib');
    const comboBoxKbliRef = useRef<IComboBox>(null);
    const [daftarKbliSelected, setDaftarKbliSelected] = useState<({key: string} & Partial<IKbli>)[]>([]);
    
    //react hook form variable
    const methodNib = useForm<FormData>({
        resolver: zodResolver(DokumenNibSchema),
        // defaultValues: DokumenNibSchema.parse({
        //     id: '010301',
        //     nama: 'NIB - OSS',
        //     // kategoriDokumen: null,
        //     nomor: '',
        //     // tanggal: null,
        //     // daftarKbli: []
        // })
    });
    const {handleSubmit, control} = methodNib;
    

    const [daftarKbli] = useWatch({
        control,
        name: ['daftarKbli']
    });

    const methods = useForm<IDokumenUpload>({
        resolver: zodResolver(dokumenUploadSchema),
    });

    const [dokumen, dokumens] = useWatch({
        control: methods.control, 
        name: ['dokumen', 'dokumens']
    });

    //rtk query perusahaan variable hook
    const { data: listKbli, isFetching: isFetchingDataKbli, isError: isErrorKbli } = useGetKbliByKodeQuery(kodeKbli, {skip: (kodeKbli.length < 2 || kodeKbli.length > 5) ? true : false});
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
                console.log(data);
                // try {
                //     let regDok: Partial<IRegisterDokumen> = {
                //         dokumen: data,
                //         registerPerusahaan: registerPerusahaan,
                //     };

                //     await addRegisterDokumen(regDok).unwrap().then(
                //         async (payload) => {
                //             var formData = new FormData();
                //             formData.append('file', dokumen);
                //             await uploadFileDokumen({
                //                 idRegisterDokumen: payload.id as string,
                //                 npwpPerusahaan: payload.registerPerusahaan?.perusahaan!.id as string,
                //                 formData: formData
                //             });
                //             hideModal();
                //         }
                //     );
                // } catch (error) {
                //     //terjadi kegagalan
                // } finally {
                //     setDaftarKbliSelected([]);
                // }
            }
        ),
        [registerPerusahaan, dokumen]
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
                        <TemplateDokumenNib />
                    </FormProvider>    
                    <Stack.Item>
                        <FormProvider {...methods}>
                            <FileUpload 
                                limit={1} 
                                multiple={false} 
                                name='dokumen' 
                                mime='application/pdf' 
                                disabled={daftarKbli?.length > 0 ? false:true}/>
                        </FormProvider>  
                    </Stack.Item>
                    <Stack.Item align="end">
                        <PrimaryButton 
                            style={{marginTop: 16, width: 100}}
                            text="Simpan" 
                            onClick={simpanDokumen}
                            disabled={dokumen?false:true}
                        />
                    </Stack.Item>  
                </Stack> 
            </div>               
        </Modal>
    );
};