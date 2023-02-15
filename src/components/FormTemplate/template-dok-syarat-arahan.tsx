import { DefaultButton, Dropdown, find, IconButton, IDropdownOption, IIconProps, IStackTokens, ITooltipHostStyles, Stack, TooltipHost } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useGetRegisterDokumenByIdPerusahaanQuery } from "../../features/dokumen/register-dokumen-api-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";
import { ModalFormulirAddDokumenNib } from "../Modal/ModalFormulirAddDokumenNib";

const sectionStackTokens: IStackTokens = { childrenGap: 2 };
const stackTokens = { childrenGap: 4 };
const calloutProps = { gapSpace: 0 };
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
const plusIcon: IIconProps = { iconName: 'CirclePlus' };

export const TemplateDokumenSyaratArahan = () => {
    //react-form hook
    const {control, setValue} = useFormContext();
    const [
        registerPerusahaan, daftarDokumenSyarat,
    ] = useWatch({
        control: control, 
        name: [
            'registerPerusahaan', 'daftarDokumenSyarat'
        ]
    });

    console.log(daftarDokumenSyarat);

    const [isModalAddDokumenNibOpen, { setTrue: showModalAddDokumenNib, setFalse: hideModalAddDokumenNib }] = useBoolean(false);

    const { data: daftarDok, error: errorFetchDataDok,  isFetching: isFetchingDaftarDok, isError } = useGetRegisterDokumenByIdPerusahaanQuery(registerPerusahaan != undefined ? registerPerusahaan.id:null, {skip: registerPerusahaan == undefined ? true: false});
    
    const dokNibOptions: IDropdownOption<any>[] = useMemo(
        () => {
            var dt:IDropdownOption<any>[] = []
            if(daftarDok != undefined) {                      
                    daftarDok.map(
                        (t) => {
                            if(t.dokumen?.id == '010301'){
                                dt.push({
                                    key: t.id as string,
                                    text: `${t.dokumen?.nama}/nib: ${t.dokumen?.nomor}/tanggal: ${t.dokumen?.tanggal != undefined ? t.dokumen.tanggal : '-'}`
                                });
                            }   
                            else {
                                // dt.push({
                                //     key: t.id as string,
                                //     text: `${t.dokumen?.nama} | tanggal : ${t.dokumen?.tanggal != undefined ? t.dokumen.tanggal : '-'}`
                                // });
                            }                         
                        }
                    );   
            }
            
            return dt;
        },
        [daftarDok]
    );

    const dokAktaPendirianOptions: IDropdownOption<any>[] = useMemo(
        () => {
            var dt:IDropdownOption<any>[] = []
            if(daftarDok != undefined) {                      
                    daftarDok.map(
                        (t) => {
                            if(t.dokumen?.id == '010101'){
                                dt.push({
                                    key: t.id as string,
                                    text: `${t.dokumen?.nama}/nib: ${t.dokumen?.nomor}/tanggal: ${t.dokumen?.tanggal != undefined ? t.dokumen.tanggal : '-'}`
                                });
                            }                    
                        }
                    );   
            }
            
            return dt;
        },
        [daftarDok]
    );

    const handleSetRegisterDokNib = useCallback(
        (_e, item) => {
            var itemSelected = find(daftarDok!, (i) => i.id == item.key) as IRegisterDokumen;
            
            var tmpData = daftarDokumenSyarat == undefined ? []:cloneDeep(daftarDokumenSyarat);

            // let findObj = find(tmpData, (i) => i.id == item.key) as IRegisterDokumen;

            if(find(tmpData, (i) => i.id == item.key) as IRegisterDokumen == undefined) {
                tmpData.push(itemSelected);
                setValue('daftarDokumenSyarat', tmpData);
            }            
            
        },
        [daftarDok, daftarDokumenSyarat]
    );
    
    return (
        <Stack tokens={stackTokens}>
            <Stack horizontal tokens={sectionStackTokens}>
                <Stack.Item styles={{root: {width: 400}}}>
                    <Dropdown
                        options={dokNibOptions}
                        placeholder="--nib--"
                        onChange={handleSetRegisterDokNib}
                    />
                </Stack.Item>
                <Stack.Item>                            
                    <TooltipHost
                        id="dok-nib"
                        content="Klik untuk tambah pilihan dok nib"
                        calloutProps={calloutProps}
                        styles={hostStyles}
                    >
                        <IconButton 
                            iconProps={plusIcon} 
                            aria-label="Plus" 
                            onClick={showModalAddDokumenNib}/>
                    </TooltipHost>
                </Stack.Item>            
            </Stack>
            <Stack horizontal tokens={sectionStackTokens}>
                <Stack.Item styles={{root: {width: 400}}}>
                    <Dropdown
                        options={dokAktaPendirianOptions}
                        placeholder="--akta pendirian--"
                        onChange={handleSetRegisterDokNib}
                    />
                </Stack.Item>
                <Stack.Item>                            
                    <TooltipHost
                        id="dok-akta-pendirian"
                        content="Klik untuk tambah pilihan dok akta pendirian"
                        calloutProps={calloutProps}
                        styles={hostStyles}
                    >
                        <IconButton 
                            iconProps={plusIcon} 
                            aria-label="Plus" 
                            onClick={showModalAddDokumenNib}/>
                    </TooltipHost>
                </Stack.Item>            
            </Stack>
            {
                isModalAddDokumenNibOpen == true ? 
                <ModalFormulirAddDokumenNib
                    isModalOpen={isModalAddDokumenNibOpen}
                    hideModal={hideModalAddDokumenNib}
                    isDraggable={true}
                /> : null  
            } 
        </Stack>
    );
};