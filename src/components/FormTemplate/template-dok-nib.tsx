import { ComboBox, DatePicker, DayOfWeek, DefaultPalette, IComboBox, IComboBoxOption, IDropdownOption, IStackItemStyles, MaskedTextField, Stack } from "@fluentui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import find from "lodash.find";
import omit from "lodash.omit";
import remove from "lodash.remove";
import { useCallback, useMemo, useRef, useState } from "react";
import { Controller, FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { array, object, z } from "zod";
import { DayPickerIndonesiaStrings, onFormatDate, onFormatDateUtc } from "../../features/config/config";
import { useGetKbliByKodeQuery } from "../../features/dokumen/kbli-api-slice";
import { IKbli } from "../../features/dokumen/kbli-slice";
import { IRegisterKbli } from "../../features/dokumen/register-kbli-slice";
import { DataListKbliFluentUI } from "../DataList/DataListKBLIFluentUI";
import { FileUpload } from "../UploadFiles/FileUpload";

const stackTokens = { childrenGap: 4 };
const stackHorTokens = { childrenGap: 8 };
const stackItemStyles: IStackItemStyles = {
    root: {
        border: `1px solid ${DefaultPalette.orangeLighter}`,
        padding: 4,
    },
};

const dokumenUploadSchema = object({
    dokumen: z.instanceof(File),
    dokumens: array(z.instanceof(File))
});
type FormData = z.infer<typeof dokumenUploadSchema>;


export const TemplateDokumenNib = () => {
    //react hook form contex
    const {control, setValue} = useFormContext();
    const [
        nomor, tanggal, daftarKbli
    ] = useWatch({
        control: control, 
        name: [
            'nomor', 'tanggal', 'daftarKbli'
        ]
    });
    //react hook form variable
    const methods = useForm<FormData>({
        resolver: zodResolver(dokumenUploadSchema),
    });
    const [dokumen] = useWatch({
        control: methods.control, 
        name: ['dokumen']
    });
    // local state
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [kodeKbli, setKodeKbli] = useState<string>('01');
    const [daftarKbliSelected, setDaftarKbliSelected] = useState<({key: string} & Partial<IKbli>)[]>([]);
    const comboBoxKbliRef = useRef<IComboBox>(null);
    //rtk query perusahaan variable hook
    const { data: listKbli, isFetching: isFetchingDataKbli, isError: isErrorKbli } = useGetKbliByKodeQuery(kodeKbli, {skip: (kodeKbli.length < 2 || kodeKbli.length > 5) ? true : false});

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
    
    const handleSelectedDate = useCallback(
        (date) => {
            setValue('tanggal', onFormatDateUtc(date));
        },
        []
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

            let tmpDaftarRegisterKbli = daftarKbli ? cloneDeep(daftarKbli):[];
            
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

    // const onChangeNib = useCallback(
    //     (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    //       if (!newValue || newValue.length == 13) {
    //         setValue('nomor', newValue || '');
    //       }
    //     },
    //     [],
    // );
    
    return(
        <Stack tokens={stackTokens} >
            <Stack horizontal tokens={stackHorTokens}>
                <Stack.Item>
                    <Controller
                        name="nomor"
                        control={control}
                        render={
                            ({
                                field: {onChange, value},
                                fieldState: {error}
                            }) => 
                            <MaskedTextField 
                                label="Nib"
                                required
                                mask="9999999999999"
                                errorMessage={error?.message == 'Required'?'Harus diisi':error?.message}
                                onChange={(e, v) => {
                                    onChange(v);
                                }}
                                value={value}
                            />
                        }
                    />                    
                </Stack.Item>
                <Stack.Item grow>
                    <Controller
                        name="tanggal"
                        control={control}
                        render={
                            ({
                                field: {onChange, value},
                                fieldState: {error}
                            }) =>
                            <DatePicker
                                label="Tanggal pengesahan"
                                firstDayOfWeek={firstDayOfWeek}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                strings={DayPickerIndonesiaStrings}
                                formatDate={onFormatDate}
                                onSelectDate={(v) =>{
                                    onChange(handleSelectedDate(v));
                                }}
                                disabled={nomor ? false : true}
                            />
                        }
                    />
                    
                </Stack.Item>
            </Stack>                    
            <Stack.Item styles={stackItemStyles}>
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
                <DataListKbliFluentUI 
                    daftarKbli={daftarKbliSelected}
                    handleHapus={handleHapusKbli}
                />
            </Stack.Item>
            <Stack.Item>
                <FormProvider {...methods}>
                    <FileUpload 
                        limit={1} 
                        multiple={false} 
                        name='dokumen' 
                        mime='application/pdf' 
                        disabled={daftarKbliSelected.length > 0 ? false:true}/>
                </FormProvider>  
            </Stack.Item>
        </Stack> 
    );
}