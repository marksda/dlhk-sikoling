import { 
    ContextualMenu, FontSizes, FontWeights, 
    getTheme, IconButton, IDragOptions, IIconProps, 
    IProgressIndicatorStyles, mergeStyleSets, Modal, PrimaryButton, 
    ProgressIndicator, Stack } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import cloneDeep from "lodash.clonedeep";
import { FC, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { object, z, array, TypeOf } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from "../../app/hooks";
import { TemplatePegawai } from "../FormTemplate/template-pegawai";
import { IPegawai } from "../../features/pegawai/pegawai-slice";
import { useAddPegawaiMutation } from "../../features/pegawai/pegawai-api-slice";

interface IModalFormulirPegawaiProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};

const pegawaiSchema = object({
    nik: z.string().regex(/^\d+$/, {message: 'input bukan abjad'}).length(17, {message: 'Nik harus 17 digit'}),
    nama: z.string().min(3, {message: 'nama diisi minimal 3 karakter'}),
    jenisKelamin: object({
        id: z.string(),
        nama: z.string()
    }),
    jabatan: object({
        id: z.string(),
        nama: z.string()
    }),
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
    fax: z.string().optional(),
    telepone: z.string(),
    email: z.string().min(1, { message: "Harus diisi" })
    .email("bukan format email yang benar"),
});
type FormData = z.infer<typeof pegawaiSchema>;

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

export const ModalFormulirAddPegawai: FC<IModalFormulirPegawaiProps> = ({isModalOpen, hideModal, isDraggable}) => {
    const registerPerusahaan = useAppSelector((state) => state.registerPerusahaan);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const titleId = useId('Formulir Dokumen nib');

    const methods = useForm<FormData>({
        resolver: zodResolver(pegawaiSchema),
    });
    const {handleSubmit} = methods;

    //rtk query mutation addPerusahaan variable
    const [addPegawai] = useAddPegawaiMutation();

    const handleCloseModal = useCallback(
        () => {
            // reset();
            // setMotionKey('tahapPertama');
            hideModal();
        },
        []
    );   
    
    const simpanPegawai = useCallback(
        handleSubmit(
            async (data) => {                  
                try {
                    var pegawai: IPegawai = {
                        id: null,
                        perusahaan: cloneDeep(registerPerusahaan),
                        person: {
                            nik: data.nik,
                            nama: data.nama,
                            jenisKelamin: cloneDeep(data.jenisKelamin),
                            alamat: {
                                propinsi: cloneDeep(data.propinsi),
                                kabupaten: cloneDeep(data.kabupaten),
                                kecamatan: cloneDeep(data.kecamatan),
                                desa: cloneDeep(data.desa),
                                keterangan: data.keterangan
                            },
                            kontak: {
                                telepone: data.telepone,
                                fax: data.fax,
                                email: data.email
                            },
                            scanKTP: null
                        },
                        jabatan: cloneDeep(data.jabatan)
                    };
                    await addPegawai(pegawai).unwrap().then(
                        async (payload) => {
                            // var formData = new FormData();
                            // formData.append('file', dokumen);
                            // await uploadFileDokumen({
                            //     idRegisterDokumen: payload.id as string,
                            //     npwpPerusahaan: payload.registerPerusahaan?.perusahaan!.id as string,
                            //     formData: formData
                            // });
                            console.log(payload);
                            hideModal();
                        }
                    );
                } catch (error) {
                    console.log(error);
                }                
            }
        ),
        [registerPerusahaan]
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
                    <span id={titleId}>Formulir Penanggung Jawab</span>
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
                        <TemplatePegawai />                         
                        <Stack.Item align="end">
                            <PrimaryButton 
                                style={{marginTop: 16, width: 100}}
                                text="Simpan" 
                                onClick={simpanPegawai}
                            />
                        </Stack.Item>                   
                    </FormProvider>
                </Stack> 
            </div>               
        </Modal>
    );
};