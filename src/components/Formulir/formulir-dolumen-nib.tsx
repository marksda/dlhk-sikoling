import { FC, FormEvent, useCallback, useState } from "react";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";
import { FontIcon, Label, Stack, mergeStyleSets } from "@fluentui/react";
import { useGetOnlyofficeConfigEditorMutation, useReplaceFileMutation, useUploadFileMutation } from "../../features/repository/service/sikoling-api-slice";
import { useForm } from "react-hook-form";
import { RegisterDokumenNibSchema } from "../../features/schema-resolver/zod-schema";
import cloneDeep from "lodash.clonedeep";
import { zodResolver } from "@hookform/resolvers/zod";

interface IFormulirRegisterDokumenNibOssFluentUIProps {
    mode?: string;
    dokumen?: IDokumen;
    registerPerusahaan?: IRegisterPerusahaan;
    dataLama?: IRegisterDokumen<IDokumenNibOss>;
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
});

export const FormulirRegisterDokumenNibOss: FC<IFormulirRegisterDokumenNibOssFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama, closeWindow}) => { 

    const [disableForm, setDisableForm] = useState<boolean>(false);
    const [configOnlyOfficeEditor, setConfigOnlyOfficeEditor] = useState<any|null>(null);
    //react form hook
    const {handleSubmit, control, setValue, resetField} = useForm<IRegisterDokumen<IDokumenNibOss>>({
        defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{
          id: null,
          registerPerusahaan: {id: registerPerusahaan?.id},
          dokumen: {...dokumen}
        },
        resolver: zodResolver(RegisterDokumenNibSchema)
    });

    //rtk query
    const [ uploadFile, {isLoading: isLoadingUploadFile}] = useUploadFileMutation();
    const [ replaceFile, {isLoading: isLoadingReplaceFile}] = useReplaceFileMutation();
    const [ getOnlyofficeConfigEditor, {isLoading: isLoadingGetOnlyofficeConfigEditor}] = useGetOnlyofficeConfigEditorMutation();
    
    const _bindClickEventInputFile = useCallback(
      (e) => {            
          e.stopPropagation();
          if(!disableForm) {
            document.getElementById('fileUpload')!.click();
          }        
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
                    subPath: `/file/upload?fileNameParam=/nib_oss/temp/${namaFile}`,
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
                          hasil.width =  `${window.innerWidth - 310}px`; 
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
                  replaceFile(parm).unwrap()
                    .then((firstPromiseResult) => {
                      setValue("lokasiFile", firstPromiseResult.uri);
                      getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${firstPromiseResult.uri}`).unwrap()
                        .then((secondPromiseResult) => {
                          setDisableForm(false);
                          let hasil = cloneDeep(secondPromiseResult);
                          hasil.height = `${window.innerHeight - 195}px`;            
                          hasil.width =  `${window.innerWidth - 310}px`; 
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
                default:
                  break;
              }
            }
        },
        [mode, dataLama]
    );
      
    return (
        <Stack.Item>
            <Stack>
              <input type="file" id="fileUpload" style={{display: 'none'}} onChange={_handleFile} />
              { configOnlyOfficeEditor == null && mode == 'add' &&
              <Stack.Item align="center">                          
                <div className={contentStyles.fileViewContainer} onClick={_bindClickEventInputFile}> 
                  <FontIcon aria-label="Icon" iconName="OpenFile" className={contentStyles.iconContainer}/>
                  <Label disabled style={{paddingBottom: 0}}>Clik untuk memilih file akta pendirian</Label>
                  <Label disabled style={{paddingTop: 0}}>(ukuran maksimal file 4MB)</Label><br/>
                </div>                        
              </Stack.Item> 
              } 
            </Stack>
        </Stack.Item>
    );
}