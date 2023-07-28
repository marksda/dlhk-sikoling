import { FC, useState} from "react";
import { z } from "zod";
import { DokumenAktaPendirianSchema, RegisterDokumenSchema } from "../../features/schema-resolver/zod-schema";
import { Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { useDeleteRegisterDokumenMutation, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation } from "../../features/repository/service/sikoling-api-slice";

export const RegisterDokumenAktaPendirianSchema = RegisterDokumenSchema.omit({dokumen: true}).extend({dokumen: DokumenAktaPendirianSchema});
export type registerDokumenAktaPendirianSchema = z.infer<typeof RegisterDokumenAktaPendirianSchema>;
interface IFormulirRegisterDokumenAktaPendirianFluentUIProps {
  mode?: string;
  dokumen?: IDokumen;
  registerPerusahaan?: IRegisterPerusahaan;
  dataLama?: registerDokumenAktaPendirianSchema;
};
const stackTokens = { childrenGap: 8 };

export const FormulirRegisterDokumenAktaPendirian: FC<IFormulirRegisterDokumenAktaPendirianFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama}) => { 
  //local state
  const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen.nomor!:'');
  const [disableForm, setDisableForm] = useState<boolean>(false);
  //react hook-form
  const {handleSubmit, control, setValue, resetField, watch} = useForm<registerDokumenAktaPendirianSchema>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama) as registerDokumenAktaPendirianSchema:{
      id: null,
      registerPerusahaan: {id: registerPerusahaan?.id!},
      dokumen: {
        id: dokumen?.id!
      }
    },
    resolver: zodResolver(RegisterDokumenAktaPendirianSchema)
  });
  //rtk query
  const [ saveRegisterDokumen, {isLoading: isLoadingSaveRegisterDokumen}] = useSaveRegisterDokumenMutation();
  const [ updateRegisterDokumen, {isLoading: isLoadingUpdateRegisterDokumen}] = useUpdateRegisterDokumenMutation();
  // const [ updateIdRegisterDokumen, {isLoading: isLoadingUpdateIdRegisterDokumen}] = useUpdateIdRegisterDokumenMutation();
  const [ deleteRegisterDokumen, {isLoading: isLoadingDeleteRegisterDokumen}] = useDeleteRegisterDokumenMutation();

  const onSubmit: SubmitHandler<registerDokumenAktaPendirianSchema> = async (data) => {
    setDisableForm(true);
    try {
      let formData = new FormData();
      switch (mode) {
        case 'add':          
          // formData.append('imageKtp', selectedFiles?.item(0)!);
          // formData.append('personData', JSON.stringify(data));
          // await savePerson(formData).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // hideModal();
          break;
        default:
          break;
      }      
    } catch (error) {
      setDisableForm(false);
    }
  };

  const onError: SubmitErrorHandler<registerDokumenAktaPendirianSchema> = async (err) => {
    console.log('error', err);
    // if(mode == 'delete') {
    //   await deletePerson(dataLama as IPerson).unwrap().then((originalPromiseResult) => {
    //     setDisableForm(false);
    //   }).catch((rejectedValueOrSerializedError) => {
    //     setDisableForm(false);
    //   }); 
    //   hideModal();
    // }
    // else {
    //   console.log('error', err);
    // }
  };

  return (
    <Stack>         
      <Stack.Item>
        <Label>Akta pendirian</Label>
        <Stack style={{border: '1px solid #e1dfdf', padding: 8}} tokens={stackTokens}>
          <Stack.Item>
            <Stack horizontal tokens={stackTokens}>
              <Stack.Item>
                <Label style={{width: 72}}>Nomor</Label>
              </Stack.Item>
              <Stack.Item>
                <Controller 
                  name="dokumen.nomor"
                  control={control}
                  render={
                    ({field: {onChange, onBlur}, fieldState: { error }}) => (
                      <TextField
                          placeholder="isi dengan nomor dokumen"
                          value={nomorTextFieldValue}
                          onChange={
                            (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                              onChange(newValue || '');
                              setNomorTextFieldValue(newValue || '');
                            }
                          }
                          disabled={mode == 'delete' ? true:disableForm}
                          errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                      />
                    )
                  }
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item>
        <PrimaryButton 
          style={{marginTop: 16, width: '100%'}}
          text={mode == 'delete' ? 'Hapus':'Simpan'} 
          onClick={handleSubmit(onSubmit, onError)}
          disabled={disableForm}
        />
      </Stack.Item>
    </Stack>
  );
}