import { ComboBox, ContextualMenu, DatePicker, DayOfWeek, FontSizes, FontWeights, getTheme, IComboBox, IComboBoxOption, IconButton, IDragOptions, IDropdownOption, IIconProps, IProgressIndicatorStyles, mergeStyleSets, Modal, PrimaryButton, ProgressIndicator, Stack, TextField } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { DayPickerIndonesiaStrings } from "../../features/config/config";
import { IDokumenNibOss } from "../../features/dokumen/dokumen-nib-oss-slice";
import { useGetKbliByKodeQuery } from "../../features/dokumen/kbli-api-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";

interface IModalFormulirDokumenNibProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};

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
const stackTokens = { childrenGap: 2 };
const stackHorTokens = { childrenGap: 8 };


export const ModalFormulirAddDokumenNib: FC<IModalFormulirDokumenNibProps> = ({isModalOpen, hideModal, isDraggable}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [kodeKbli, setKodeKbli] = useState<string>('01');
    const titleId = useId('Formulir Dokumen nib');
    const comboBoxKbliRef = useRef<IComboBox>(null);
    

    //react hook form variable
    const { control, handleSubmit, setValue, reset, setError } = useForm<IDokumenNibOss>({
        mode: 'onSubmit',
        defaultValues: {
            id: null,
            nama: null,
            kategoriDokumen: null,
            nomor: null,
            tanggal: null,
            daftarKbli: null
        }
    });

    //rtk query perusahaan variable hook
    const { data: daftarKbli, isFetching: isFetchingDataKbli, isError: isErrorKbli } = useGetKbliByKodeQuery(kodeKbli, {skip: (kodeKbli.length < 2 || kodeKbli.length > 5) ? true : false});

    const kbliOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(daftarKbli != undefined) {
                return [
                    ...daftarKbli.map(
                        (t) => ({
                            key: t.kode!,
                            text: `${t.kode} - ${t.nama}`
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarKbli]
    );

    const inputKbliChange = useCallback(
        (newValue: string) => {
            setKodeKbli(newValue||'');
            if(newValue.length > 1) {
                comboBoxKbliRef.current?.focus(true);
            }
        },
        [comboBoxKbliRef],
    );

    const kbliItemClick = useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number) => {
            console.log(option, index);
        },
        [],
    );    

    const handleCloseModal = useCallback(
        () => {
            // reset();
            // setMotionKey('tahapPertama');
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
                    <Stack horizontal tokens={stackHorTokens}>
                        <Stack.Item grow>
                            <TextField label="Nib" />
                        </Stack.Item>
                        <Stack.Item grow>
                            <DatePicker
                                label="Tanggal pengesahan"
                                firstDayOfWeek={firstDayOfWeek}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                // DatePicker uses English strings by default. For localized apps, you must override this prop.
                                strings={DayPickerIndonesiaStrings}
                            />
                        </Stack.Item>
                    </Stack>                    
                    <Stack.Item>
                        <ComboBox 
                            componentRef={comboBoxKbliRef}
                            label="KBLI 2020"
                            placeholder="Ketik kode kbli untuk pencarian dan pemilihan"
                            dropdownMaxWidth={450}
                            allowFreeform={true}
                            autoComplete="on"
                            options={kbliOptions}
                            onInputValueChange={inputKbliChange}
                            onItemClick={kbliItemClick}
                        />
                    </Stack.Item>
                    <Stack.Item align="end">
                        <PrimaryButton 
                            style={{marginTop: 24, width: 100}}
                            text="Upload" 
                        />
                    </Stack.Item>  
                </Stack> 
            </div>               
        </Modal>
    );
};