import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { DatePicker, DayOfWeek, DefaultButton, FontIcon, IComboBox, IDatePickerStyleProps, IDatePickerStyles, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, Spinner, SpinnerSize, Stack, TextField, Toggle, mergeStyleSets } from "@fluentui/react";
import { sikolingApi, useDeleteFileMutation, useDeleteRegisterDokumenMutation, useGetOnlyofficeConfigEditorMutation, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation, useUploadFileMutation } from "../../features/repository/service/sikoling-api-slice";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { RegisterDokumenGenerikSchema } from "../../features/schema-resolver/zod-schema";
import cloneDeep from "lodash.clonedeep";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPickerIndonesiaStrings, utcFormatDateToDDMMYYYY, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { urlApiSikoling, urlDocumenService } from "../../features/config/config";
import { IDokumenGenerik } from "../../features/entity/dokumen-generik";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IToken } from "../../features/entity/token";
import { resetToken, setToken } from "../../features/security/token-slice";
import { Mutex } from "async-mutex";

interface IFormulirRegisterDokumenGenerikFluentUIProps {
    mode?: string;
    dokumen?: IDokumen;
    registerPerusahaan?: IRegisterPerusahaan;
    dataLama?: IRegisterDokumen<IDokumenGenerik>;
    closeWindow: () => void;
};
const contentStyles = mergeStyleSets({
  fileViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #DDDCDC',
    "&:hover": {
        background: "#F4F2F2",
        cursor: 'pointer',
        border: '1px solid #D7D7D7'
    },
    width: 800,
    height: 100,
    padding: '16px 16px 0px 16px',
  },
  iconContainer: {
    fontSize: 32,
    height: 36,
    color: '#DDDCDC',
    margin: '0 25px',
  },
  kbliContainer: {
    border: '1px solid grey',
    marginTop: 2,
    padding: '4px 4px 4px 8px',
    background: 'white',
    minHeight: 90,
    width: 370,
    maxHeight: 250,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  spanDelete: {
    color: 'red',
    cursor: 'pointer',
  }
});
const stackTokens = { childrenGap: 4 };
const dateStyle: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles> = {
  root: {
    width: 250
  }
};
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 250 } };
const mutexDokumenGenerik = new Mutex();

export const FormulirRegisterDokumenGenerik: FC<IFormulirRegisterDokumenGenerikFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama, closeWindow}) => { 
    const token = useAppSelector((state) => state.token); 
    const dispatch = useAppDispatch();

    const [tempFile, setTempFile] = useState<string|null>(null);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [selectedDate, setSelectedDate] = useState<Date|undefined>(dataLama != undefined ? dataLama.dokumen?.tanggal != undefined ? new Date(dataLama.dokumen?.tanggal!):undefined:undefined);
    const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen?.nomor!:'');
    const [isApproved, setIsApproved] = useState<boolean>(dataLama != undefined ? dataLama.statusVerified!:false);
    const [disableForm, setDisableForm] = useState<boolean>(mode == 'delete' ? false:true);
    const [configOnlyOfficeEditor, setConfigOnlyOfficeEditor] = useState<any|null>(null);
    
    //react form hook
    const {handleSubmit, control, setValue, resetField} = useForm<IRegisterDokumen<IDokumenGenerik>>({
        defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{
        id: null,
        registerPerusahaan: {id: registerPerusahaan?.id},
        dokumen: {...dokumen}
        },
        resolver: zodResolver(RegisterDokumenGenerikSchema)
    });
    //rtk query
    const [ uploadFile, {isLoading: isLoadingUploadFile}] = useUploadFileMutation();
    const [ deleteFile, {isLoading: isLoadingDeleteFile}] = useDeleteFileMutation();
    const [ getOnlyofficeConfigEditor, {isLoading: isLoadingGetOnlyofficeConfigEditor}] = useGetOnlyofficeConfigEditorMutation();
    const [ saveRegisterDokumen, {isLoading: isLoadingSaveRegisterDokumen}] = useSaveRegisterDokumenMutation();
    const [ updateRegisterDokumen, {isLoading: isLoadingUpdateRegisterDokumen}] = useUpdateRegisterDokumenMutation();
    const [ deleteRegisterDokumen, {isLoading: isLoadingDeleteRegisterDokumen}] = useDeleteRegisterDokumenMutation();

    const officeEditor = useMemo(
        () => {
            if(configOnlyOfficeEditor != null) {
                return <DocumentEditor 
                    id="onlyOfficeEditor"
                    documentServerUrl={urlDocumenService}
                    config={configOnlyOfficeEditor}
                />;
            }
        },
        [configOnlyOfficeEditor]
    );

    useEffect(
    () => {
        if(mode != 'add') {
            getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${dataLama?.lokasiFile}`).unwrap()
                .then((secondPromiseResult) => {
                    setDisableForm(false);
                    let hasil = cloneDeep(secondPromiseResult);
                    hasil.height = `${window.innerHeight - 130}px`;  
                    hasil.width =  `${window.innerWidth - 360}px`;                 
                    setConfigOnlyOfficeEditor(hasil);
                })
                .catch((rejectedValueOrSerializedError) => {
                    console.log(rejectedValueOrSerializedError);
                    setDisableForm(false);
                });
        }
    },
    [mode, dataLama]
    );

    useEffect(
    () => {
        function handleResize() {
        setConfigOnlyOfficeEditor(
            (prev: any) => {
            let hasil = cloneDeep(prev);
            hasil.height = mode == 'add' ? `${window.innerHeight - 195}px` : `${window.innerHeight - 130}px`;
            hasil.width = `${window.innerWidth - 360}px`; 
            return hasil;
            }
        );
        }

        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    },
    []
    );

    useEffect(
        () => {
          return () => {
            if(tempFile != null && mode == "add") {
              let pathFile = "/file/delete?fileNameParam=" + decodeURIComponent(tempFile.split("=")[1]);
              deleteFile(pathFile);
            }
          }      
        },
        [tempFile, mode]
    );
  
    const _bindClickEventInputFile = useCallback(
        (e) => {            
            e.stopPropagation();
            // if(!disableForm) {
            document.getElementById('fileUpload')!.click();
            // }        
        },
        [disableForm]
    );
    
    const _handleFile = useCallback(
        (event: FormEvent<HTMLInputElement>) => {            
            if(event.currentTarget.files!.length > 0) {            
                // let fileType: string = getFileType(event.currentTarget.files![0].type);
                let file = event.currentTarget.files![0];
                let namaFile = file.name;
                let formData;
                let parm;     
    
                switch (mode) {
                case 'add':
                    formData = new FormData();
                    formData.append('file', file);
                    parm = {
                    subPath: `/file/upload?fileNameParam=/${dokumen?.nama}/temp/${namaFile}`,
                    dataForm: formData
                    };  
                    uploadFile(parm).unwrap()
                    .then((firstPromiseResult) => {
                        setValue("lokasiFile", firstPromiseResult.uri);
                        getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${firstPromiseResult.uri}`).unwrap()
                        .then((secondPromiseResult) => {
                            setDisableForm(false);
                            let hasil = cloneDeep(secondPromiseResult);
                            hasil.height = `${window.innerHeight - 195}px`;            
                            hasil.width =  `${window.innerWidth - 360}px`; 

                            setTempFile(hasil.document.url);
                            setConfigOnlyOfficeEditor(hasil);
                        })
                        .catch((rejectedValueOrSerializedError) => {
                            setDisableForm(false);
                        });
                    })
                    .catch((rejectedValueOrSerializedError) => {
                        setDisableForm(false);
                    }); 
                    break;
                case 'edit':
                    formData = new FormData();
                    formData.append('file', file);
                    formData.append('idRegisterDokumen', dataLama?.id!);
                    parm = {
                    subPath: `/file/replace?fileNameParam=${namaFile}`,
                    dataForm: formData
                    };  
                    const btnElm = document.getElementById("btnUploadFileGenerik") as HTMLButtonElement;
                    const parentElm = btnElm?.parentElement;
                    const progressElm = document.createElement("progress");
                    progressElm.setAttribute("value", "0");
                    progressElm.setAttribute("max", "1");
                    progressElm.style.width = "100%";
                    progressElm.style.marginTop = "16px";
                    parentElm?.append(progressElm);
                    const uriLocator = `${urlApiSikoling}/file/replace?fileNameParam=${namaFile}`;
                    _uploadDokumen(uriLocator, formData, token, progressElm);
                    break;
                default:
                    break;
                }
            }
        },
        [mode, dataLama]
    );

    const onSubmit: SubmitHandler<IRegisterDokumen<IDokumenGenerik>> = async (data) => {
        setDisableForm(true);
        try {
        switch (mode) {
            case 'add':          
                await saveRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
                    setDisableForm(false);
                }).catch((rejectedValueOrSerializedError) => {
                    console.log(rejectedValueOrSerializedError);
                    setDisableForm(false);
                }); 
                closeWindow();
                break;
            case 'edit':
                await updateRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
                    setDisableForm(false);
                }).catch((rejectedValueOrSerializedError) => {
                    setDisableForm(false);
                }); 
                closeWindow();
                break;
            case 'delete':
                await deleteRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
                    setDisableForm(false);
                }).catch((rejectedValueOrSerializedError) => {
                    setDisableForm(false);
                }); 
                closeWindow();
                break;
            default:
                break;
        }      
        } catch (error) {
            setDisableForm(false);
        }
    };

    const onError: SubmitErrorHandler<IRegisterDokumen<IDokumenGenerik>> = async (err) => {
        console.log('error', err);
    };

    async function _uploadDokumen(uriUploadLocator: string, dataForm:FormData, _token: IToken, progressElm: HTMLProgressElement) {
        setDisableForm(true);

        axios({
            url: uriUploadLocator, 
            method: 'POST',
            responseType: 'json', 
            data: dataForm,
            headers: {
                Authorization: `Bearer ${_token.accessToken}` 
            },
            onUploadProgress: progressEvent => {
                progressElm.setAttribute("value", `${progressEvent.progress}`);
            }                
        }).then((response) => {      
            setValue("lokasiFile", response.data.uri);   
            getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${response.data.uri}`).unwrap().then((secondPromiseResult) => {
            setDisableForm(false);
            let hasil = cloneDeep(secondPromiseResult);
            hasil.height = `${window.innerHeight - 195}px`;            
            hasil.width =  `${window.innerWidth - 580}px`; 
            setConfigOnlyOfficeEditor(hasil);
            progressElm.remove();
            }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
            progressElm.remove();
            });    
            dispatch(sikolingApi.util.invalidateTags(["RegisterDokumen"]));  
        }).catch(async (error) => {   
            if(error.response.status == 401) {
                if (!mutexDokumenGenerik.isLocked()) {
                    const release = await mutexDokumenGenerik.acquire();
                    const refreshTokenUriLocator = `${urlApiSikoling}/user/refresh_token/${token.userName}`;
                    try {
                        _refreshToken(refreshTokenUriLocator, uriUploadLocator, dataForm, progressElm);

                    } catch (error) {
                        release();
                    }
                }   
                else {
                    await mutexDokumenGenerik.waitForUnlock();
                    _uploadDokumen(uriUploadLocator, dataForm, token, progressElm);
                }                  
            }
            else {
                progressElm.remove();
                alert("File gagal direupload");
            }
        });
    };

    function _refreshToken(refreshTokenUriLocator: string, uriUploadLocator: string, dataForm:FormData, progressElm: HTMLProgressElement) {
        axios({
            url: refreshTokenUriLocator, 
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            responseType: 'json',
            data: token.refreshToken      
        }).then((responseRefreshToken) => {                 
            const hasil = responseRefreshToken.data
            localStorage.removeItem('token');
            localStorage.setItem('token', JSON.stringify(hasil.token));
            dispatch(setToken(hasil.token));
            _uploadDokumen(uriUploadLocator, dataForm, hasil.token, progressElm);
            mutexDokumenGenerik.release();
        }).catch((errorRefreshToken) => {
            localStorage.removeItem('token');
            dispatch(resetToken());
            mutexDokumenGenerik.release();
        });
    };
      
    return (
        <Stack.Item>
            <Stack>
                <input type="file" id="fileUpload" style={{display: 'none'}} onChange={_handleFile} />
                { configOnlyOfficeEditor == null && mode == 'add' && !isLoadingUploadFile &&
                <Stack.Item align="center">                          
                    <div className={contentStyles.fileViewContainer} onClick={_bindClickEventInputFile}> 
                        <FontIcon aria-label="Icon" iconName="OpenFile" className={contentStyles.iconContainer}/>
                        <Label disabled style={{paddingBottom: 0}}>Clik untuk memilih file {dokumen?.nama}</Label>
                        <Label disabled style={{paddingTop: 0}}>(ukuran maksimal file 4MB)</Label><br/>
                    </div>                        
                </Stack.Item> 
                } 
                {configOnlyOfficeEditor != null &&
                <Stack.Item>
                    <Stack horizontal tokens={stackTokens}>
                        <Stack.Item style={{background: 'rgb(241 241 241)', padding: '0px 8px 8px 8px', border: '1px solid rgb(187 190 194)'}}>
                            <Stack>
                                <Stack.Item>
                                    <Label style={{borderBottom: '1px solid grey', marginBottom: 4}}>Meta file - {dokumen?.nama}</Label>
                                </Stack.Item>
                                {mode != 'add' &&
                                <Stack.Item align="center" style={{background: '#fdab2de6', width: '100%'}}>
                                    <Label style={{padding: 4}}>
                                        {registerPerusahaan?.perusahaan?.pelakuUsaha != undefined ?
                                        `${registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${registerPerusahaan?.perusahaan?.nama}`:
                                        `${registerPerusahaan?.perusahaan?.nama}`}

                                    </Label>
                                </Stack.Item>
                                }
                                <Stack.Item>
                                    <Controller 
                                        name="dokumen.tanggal"
                                        control={control}
                                        render={
                                        ({field: {onChange}, fieldState: { error }}) => (                      
                                            <DatePicker
                                            label="Tgl. penetapan/penerbitan"
                                            firstDayOfWeek={firstDayOfWeek}
                                            placeholder="Pilih tanggal"
                                            ariaLabel="Pilih tanggal"
                                            strings={DayPickerIndonesiaStrings}
                                            formatDate={utcFormatDateToDDMMYYYY}
                                            styles={dateStyle}
                                            onSelectDate={
                                                (date) => {         
                                                onChange(utcFormatDateToYYYYMMDD(date!));
                                                setSelectedDate(date!);
                                                }
                                            }
                                            value={selectedDate}
                                            disabled={mode == 'delete' ? true:disableForm}
                                            />
                                        )
                                        }
                                    />
                                </Stack.Item>
                                <Stack.Item>
                                    <Controller 
                                        name="dokumen.nomor"
                                        control={control}
                                        render={
                                        ({field: {onChange}, fieldState: { error }}) => (
                                            <TextField
                                                label="Nomor"
                                                placeholder="isikan nomor dokumen"
                                                value={nomorTextFieldValue}
                                                onChange={
                                                    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                                    if(newValue!.length > 0) {
                                                        onChange(newValue!);
                                                    }
                                                    else {
                                                        resetField("dokumen.nomor");
                                                    }
                                                    setNomorTextFieldValue(newValue||'');
                                                    }
                                                }
                                                disabled={mode == 'delete'||selectedDate==undefined ? true:disableForm}
                                                styles={textFieldStyles}
                                                errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                                                />
                                        )
                                        }
                                    />
                                </Stack.Item>
                                <Stack.Item>
                                    <Controller 
                                        name="statusVerified"
                                        control={control}
                                        render={
                                            ({field: {onChange}, fieldState: { error }}) => (                                            
                                                <Toggle
                                                    label="Approved"
                                                    checked={isApproved}
                                                    onChange={(ev: React.MouseEvent<HTMLElement>, checked?: boolean|undefined) => {                                                        
                                                        setIsApproved(checked!);
                                                        onChange(checked!);
                                                    }}
                                                    onText="Sudah"
                                                    offText="Belum"
                                                    disabled={mode == 'delete'||selectedDate==undefined ? true:disableForm}
                                                    />
                                            )
                                        }
                                    />                                    
                                </Stack.Item>
                                <PrimaryButton 
                                    style={{marginTop: 16, width: '100%'}}
                                    text={mode == 'delete' ? 'Hapus dokumen': mode == 'add' ? 'Simpan':'Update meta file'} 
                                    disabled={mode == 'delete' ? disableForm : configOnlyOfficeEditor == null ? true:disableForm}
                                    onClick={handleSubmit(onSubmit, onError)}
                                    />
                                { mode == 'edit' &&
                                <DefaultButton                                 
                                    id="btnUploadFileGenerik"
                                    style={{marginTop: 4, width: '100%'}}
                                    text={'Upload ulang dokumen'} 
                                    onClick={_bindClickEventInputFile}
                                    disabled={configOnlyOfficeEditor == null ? true:disableForm}
                                />
                                }   
                                { mode == 'edit' &&
                                <DefaultButton 
                                    style={{marginTop: 4, width: '100%'}}
                                    text={'Generate ulang dokumen'} 
                                    onClick={() => alert('Generate')}
                                    disabled={configOnlyOfficeEditor == null ? true:disableForm}
                                />
                                }     
                            </Stack>
                        </Stack.Item>
                        <Stack.Item>
                            {officeEditor}
                        </Stack.Item>
                    </Stack>
                </Stack.Item>  
                }
                {(configOnlyOfficeEditor == null && mode != 'add') || isLoadingUploadFile &&
                <Stack.Item align="center">
                <Label>Please wait...</Label>
                <Spinner size={SpinnerSize.large} />
                </Stack.Item>
                }
            </Stack>
        </Stack.Item>
    );
}