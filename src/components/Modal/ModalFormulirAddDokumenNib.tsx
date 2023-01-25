import { ComboBox, ContextualMenu, DatePicker, DayOfWeek, FontSizes, FontWeights, getTheme, IComboBox, IComboBoxOption, IconButton, IDragOptions, IDropdownOption, IIconProps, IProgressIndicatorStyles, MaskedTextField, mergeStyleSets, Modal, PrimaryButton, ProgressIndicator, Stack, TextField } from "@fluentui/react";
import { useId } from "@fluentui/react-hooks";
import cloneDeep from "lodash.clonedeep";
import find from "lodash.find";
import omit from "lodash.omit";
import remove from "lodash.remove";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useAppSelector } from "../../app/hooks";
import { DayPickerIndonesiaStrings, onFormatDate, onFormatDateUtc } from "../../features/config/config";
import { IDokumenNibOss } from "../../features/dokumen/dokumen-nib-oss-slice";
import { useGetKbliByKodeQuery } from "../../features/dokumen/kbli-api-slice";
import { IKbli } from "../../features/dokumen/kbli-slice";
import { useAddRegisterDokumenMutation } from "../../features/dokumen/register-dokumen-api-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";
import { IRegisterKbli } from "../../features/dokumen/register-kbli-slice";
import { DataListKbliFluentUI } from "../DataList/DataListKBLIFluentUI";

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
    const registerPerusahaan = useAppSelector((state) => state.registerPerusahaan);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [kodeKbli, setKodeKbli] = useState<string>('01');
    const titleId = useId('Formulir Dokumen nib');
    const comboBoxKbliRef = useRef<IComboBox>(null);
    const [daftarKbliSelected, setDaftarKbliSelected] = useState<({key: string} & Partial<IKbli>)[]>([]);
    
    //react hook form variable
    const { control, handleSubmit, setValue, reset, setError } = useForm<IDokumenNibOss>({
        mode: 'onSubmit',
        defaultValues: {
            id: '010301',
            nama: 'NIB - OSS',
            kategoriDokumen: null,
            nomor: null,
            tanggal: null,
            daftarKbli: []
        }
    });

    const [nomor, tanggal, daftarKbli] = useWatch({
        control: control, 
        name: ['nomor', 'tanggal', 'daftarKbli']
    });

    //rtk query perusahaan variable hook
    const { data: listKbli, isFetching: isFetchingDataKbli, isError: isErrorKbli } = useGetKbliByKodeQuery(kodeKbli, {skip: (kodeKbli.length < 2 || kodeKbli.length > 5) ? true : false});
    //rtk query mutation addPerusahaan variable
    const [addRegisterDokumen] = useAddRegisterDokumenMutation();

    const kbliOptions: IDropdownOption<any>[] = useMemo(
        () => {
            if(listKbli != undefined) {
                return [
                    ...listKbli.map(
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
        [listKbli]
    );

    const onChangeNib = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
          if (!newValue || newValue.length == 13) {
            setValue('nomor', newValue || '');
          }
        },
        [],
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
            let hasilSplit = option?.text.split(' - ');
            let kbli: {key: string} & Partial<IKbli> = {
                key: hasilSplit![0],
                kode: hasilSplit![0],
                nama: hasilSplit![1],                
            };
            
            let registerKbli: IRegisterKbli = {
                idNib: nomor,
                idKbli: hasilSplit![0],
                nama: hasilSplit![1]
            };

            let tmpDaftarRegisterKbli = cloneDeep(daftarKbli);
            

            // setValue("daftarKbli", tmp.map(
            //     (item) => {
            //         return omit(item, ['key']);
            //     }) 
            // );

            setDaftarKbliSelected((prev) => {
                let tmp = cloneDeep(prev);
                let findObj = find(tmp, (i) => { return i.kode === kbli.kode});
                tmpDaftarRegisterKbli?.push(registerKbli);
                if(findObj == undefined) {
                    tmp.push(kbli);
                    setValue("daftarKbli", tmpDaftarRegisterKbli);                    
                }
                return tmp;                
            });
        },
        [nomor, daftarKbli],
    );    

    const handleCloseModal = useCallback(
        () => {
            // reset();
            // setMotionKey('tahapPertama');
            hideModal();
        },
        []
    );    

    const handleHapusKbli = useCallback(
        (kode) => {
            setDaftarKbliSelected(
                (prev) => {
                    let tmp = cloneDeep(prev);
                    remove(tmp, (i) => { return i.kode === kode});
                    setValue("daftarKbli", tmp.map(
                        (item) => {
                            return omit(item, ['key']);
                        }) 
                    );
                    return tmp;
                }
            );
        },
        []
    );

    const handleSelectedDate = useCallback(
        (date) => {
            setValue('tanggal', onFormatDateUtc(date));
        },
        []
    );

    const simpanDokumen = useCallback(
        handleSubmit(
            async (data) => {                
                // console.log(data);
                try {
                    let regDok: Partial<IRegisterDokumen> = {
                        dokumen: data,
                        perusahaan: registerPerusahaan.perusahaan,
                    }
                    await addRegisterDokumen(regDok).unwrap();
                } catch (error) {
                    //terjadi kegagalan
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
                        <Stack.Item>
                            <MaskedTextField 
                                label="Nib"
                                required
                                mask="9999999999999"
                                onChange={onChangeNib}
                            />
                        </Stack.Item>
                        <Stack.Item grow>
                            <DatePicker
                                label="Tanggal pengesahan"
                                firstDayOfWeek={firstDayOfWeek}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                strings={DayPickerIndonesiaStrings}
                                formatDate={onFormatDate}
                                onSelectDate={handleSelectedDate}
                                disabled={nomor?.length != null ? false : true}
                            />
                        </Stack.Item>
                    </Stack>                    
                    <Stack.Item>
                        <ComboBox 
                            componentRef={comboBoxKbliRef}
                            label="KBLI 2020"
                            placeholder="Ketik kode kbli untuk pencarian"
                            selectedKey={null}
                            dropdownMaxWidth={450}
                            allowFreeform={true}
                            autoComplete="on"
                            options={kbliOptions}
                            onInputValueChange={inputKbliChange}
                            onItemClick={kbliItemClick}
                            disabled={tanggal == null ? true:false}
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <DataListKbliFluentUI 
                            daftarKbli={daftarKbliSelected}
                            handleHapus={handleHapusKbli}
                        />
                    </Stack.Item>
                    <Stack.Item align="end">
                        <PrimaryButton 
                            style={{marginTop: 24, width: 100}}
                            text="Upload" 
                            onClick={simpanDokumen}
                            disabled={daftarKbli?.length == 0 ? true:false}
                        />
                    </Stack.Item>  
                </Stack> 
            </div>               
        </Modal>
    );
};