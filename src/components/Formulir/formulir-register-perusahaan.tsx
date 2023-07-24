import { ContextualMenu, Dropdown, FontWeights, IComboBoxOption, IDragOptions, IDropdownOption, IIconProps, IconButton, MaskedTextField, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDaftarPelakuUsahaByFiltersQuery } from "../../features/repository/service/pelaku-usaha-api-slice";
import { parseNpwp } from "../../features/config/helper-function";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { RegisterPerusahaanSchema } from "../../features/schema-resolver/zod-schema";
import { useGetDaftarDataKategoriPelakuUsahaQuery, useGetDaftarDataModelPerizinanQuery, useGetDaftarDataSkalaUsahaQuery } from "../../features/repository/service/sikoling-api-slice";
import cloneDeep from "lodash.clonedeep";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";


interface IFormulirRegisterPerusahaanFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  // showModal: () => void;
  hideModal: () => void;
  dataLama?: IRegisterPerusahaan;
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    minWidth: 450
  },
  header: [
    // eslint-disable-next-line deprecation/deprecation
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: 'inherit',
    margin: '0',
  },
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});
const cancelIcon: IIconProps = { iconName: 'Cancel' };
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

export const FormulirRegisterPerusahaan: FC<IFormulirRegisterPerusahaanFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
    //local state
    const [selectedKeyModelPerizinan, setSelectedKeyModelPerizinan] = useState<string|undefined>(dataLama != undefined ? dataLama.perusahaan?.modelPerizinan?.id!:undefined);
    const [selectedKeySkalaUsaha, setSelectedKeySkalaUsaha] = useState<string|undefined>(dataLama != undefined ? dataLama.perusahaan?.skalaUsaha?.id!:undefined);
    const [selectedKeyKategoriPelakuUsaha, setSelectedKeyKategoriPelakuUsaha] = useState<string|null|undefined>(dataLama != undefined ? dataLama.perusahaan?.pelakuUsaha?.kategoriPelakuUsaha?.id!:undefined);
    const [selectedKeyPelakuUsaha, setSelectedKeyPelakuUsaha] = useState<string|null|undefined>(dataLama != undefined ? dataLama.perusahaan?.pelakuUsaha?.id!:undefined);
    const [queryKategoriPelakuUsahaParams, setQueryKategoriPelakuUsahaParams] = useState<IQueryParamFilters>({
      pageNumber: 1,
      pageSize: 0,
      filters: dataLama != undefined ? [{
        fieldName: 'id_skala_usaha',
        value: dataLama.perusahaan?.skalaUsaha?.id!
      }]:[],
      sortOrders: [
          {
              fieldName: 'nama',
              value: 'ASC'
          },
      ],
    });
    const [queryPelakuUsahaParams, setQueryPelakuUsahaParams] = useState<IQueryParamFilters>({
      pageNumber: 1,
      pageSize: 0,
      filters: dataLama != undefined ? [{
        fieldName: 'kategori_pelaku_usaha',
        value: dataLama.perusahaan?.pelakuUsaha?.kategoriPelakuUsaha?.id!
      }]:[],
      sortOrders: [
          {
              fieldName: 'nama',
              value: 'ASC'
          },
      ],
    });
    const [npwpPerusahaan, setNpwpPerusahaan] = useState<string|undefined>(dataLama != undefined ? dataLama.perusahaan?.id!:undefined);
    const [badanUsaha, setBadanUsaha] = useState<string|null|undefined>(dataLama != undefined ? dataLama.perusahaan?.pelakuUsaha?.singkatan!:undefined); 
    const [namaTFValue, setNamaTFValue] = useState<string>('');  
    const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
    const titleId = useId('title');
    const { handleSubmit, control, resetField, setValue } = useForm<IRegisterPerusahaan>({
      defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{
        id: null, tanggalRegistrasi: null, kreator: null, verifikator: null, statusVerifikasi: null   
      },
      resolver: zodResolver(RegisterPerusahaanSchema),
    });

    const { data: postsModelPerizinan, isLoading: isLoadingPosts } = useGetDaftarDataModelPerizinanQuery({
      pageNumber: 1,
      pageSize: 0,
      filters: [],
      sortOrders: [
        {
          fieldName: 'nama',
          value: 'DES'
        },
      ],
    });
    const { data: postsSkalaUsaha, isLoading: isLoadingPostsSkalaUsaha } = useGetDaftarDataSkalaUsahaQuery({
      pageNumber: 1,
      pageSize: 0,
      filters: [],
      sortOrders: [
          {
              fieldName: 'nama',
              value: 'ASC'
          },
      ],
    });
    const { data: postsKategoriPelakuUsaha, isLoading: isLoadingPostsKategoriPelakuUsaha } = useGetDaftarDataKategoriPelakuUsahaQuery(queryKategoriPelakuUsahaParams, {skip: selectedKeySkalaUsaha == null ? true:false}); 
    const { data: postsPelakuUsaha, isLoading: isLoadingPostsPelakuUsaha } = useGetDaftarPelakuUsahaByFiltersQuery(queryPelakuUsahaParams, {skip: selectedKeyKategoriPelakuUsaha == undefined ? true:false});  

    const dragOptions = useMemo(
      (): IDragOptions => ({
        moveMenuItemText: 'Move',
        closeMenuItemText: 'Close',
        menu: ContextualMenu,
        keepInBounds,
        dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
      }),
      [keepInBounds],
    );

    const optionsModelPerizinan: IComboBoxOption[]|undefined = useMemo(
      () => (
        postsModelPerizinan?.map((item):IComboBoxOption => {
          return {
            key: item.id!,
            text: item.singkatan!,
            data: item
          };
        })
      ),
      [postsModelPerizinan]
    );

    const optionsSkalaUsaha: IComboBoxOption[]|undefined = useMemo(
      () => (
        postsSkalaUsaha?.map((item):IComboBoxOption => {
          return {
            key: item.id!,
            text: item.singkatan!,
            data: item
          };
        })
      ),
      [postsSkalaUsaha]
    );

    const optionsKategoriPelakuUsaha: IComboBoxOption[]|undefined = useMemo(
      () => (
        postsKategoriPelakuUsaha?.map((item):IComboBoxOption => {
          return {
            key: item.id!,
            text: item.nama!,
            data: item
          };
        })
      ),
      [postsKategoriPelakuUsaha]
    );

    const optionsPelakuUsaha: IComboBoxOption[]|undefined = useMemo(
      () => (
        postsPelakuUsaha?.map((item):IComboBoxOption => {
          return {
            key: item.id!,
            text: `${item.nama!} (${item.singkatan!})`,
            data: item
          };
        })
      ),
      [postsPelakuUsaha]
    );

    const _onHandleOnChangeModelPerizinanDropDown = useCallback(
      (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        let modelPerizinan = cloneDeep(postsModelPerizinan?.at(index!));

        setValue('perusahaan.modelPerizinan', modelPerizinan!);
        setSelectedKeyModelPerizinan(option?.key as string);
      },
      [postsModelPerizinan]
    );

    const _onHandleOnChangeSkalaUsahaDropDown = useCallback(
      (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
          _resetKategoriPelakuUsaha();
          let skalaUsaha = cloneDeep(postsSkalaUsaha?.at(index!));
          setQueryKategoriPelakuUsahaParams(
            prev => {
                let tmp = cloneDeep(prev);
                let filters = cloneDeep(tmp.filters);
                let found = filters?.findIndex((obj) => {return obj.fieldName == 'id_skala_usaha'}) as number;     
                                                    
                if(found == -1) {
                    filters?.push({
                        fieldName: 'id_skala_usaha',
                        value: option?.key as string
                    });
                }
                else {
                    filters?.splice(found, 1, {
                        fieldName: 'id_skala_usaha',
                        value: option?.key as string
                    })
                }
                
                tmp.pageNumber = 1;
                tmp.filters = filters;             
                return tmp;
            }
          );
          setValue('perusahaan.skalaUsaha', skalaUsaha!);
          setSelectedKeySkalaUsaha(option?.key as string);
      },
      [postsSkalaUsaha]
    );

    const _resetKategoriPelakuUsaha = useCallback(
      () => {
        _resetPelakuUsaha();
        setSelectedKeyKategoriPelakuUsaha(null);
      },
      []
    );

    const _resetPelakuUsaha = useCallback(
      () => {
        _resetNpwpPerusahaan()
        resetField("perusahaan.pelakuUsaha");
        setSelectedKeyPelakuUsaha(null);
      },
      []
    );

    const _resetNpwpPerusahaan = useCallback(
      () => {
        resetField("perusahaan.id");
        setNpwpPerusahaan(undefined);
      },
      []
    );

    const _onHandleOnChangeKategoriPelakuUsahaDropDown = useCallback(
      (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {        
        // console.log(option?.key);
        _resetPelakuUsaha();
        _resetNpwpPerusahaan();

        setQueryPelakuUsahaParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'kategori_pelaku_usaha'}) as number;     
                                                  
              if(found == -1) {
                  filters?.push({
                      fieldName: 'kategori_pelaku_usaha',
                      value: option?.key as string
                  });
              }
              else {
                  filters?.splice(found, 1, {
                      fieldName: 'kategori_pelaku_usaha',
                      value: option?.key as string
                  })
              }
              
              tmp.pageNumber = 1;
              tmp.filters = filters;             
              return tmp;
          }
        );
        setSelectedKeyKategoriPelakuUsaha(option?.key as string);
      },
      [postsPelakuUsaha]
    );

    const _onHandleOnChangePelakuUsahaDropDown = useCallback(
      (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
          let pelakuUsaha = cloneDeep(postsPelakuUsaha?.at(index!));  
          setValue('perusahaan.pelakuUsaha', pelakuUsaha!);
          setSelectedKeyPelakuUsaha(option?.key as string);
          setBadanUsaha(pelakuUsaha?.singkatan!);
        },
        [postsPelakuUsaha]
    );

    const _onHandleOnChangeTextFieldNpwpPribadi = useCallback(
      (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        // setNamaTFValue(newValue || '');
        setNpwpPerusahaan(newValue);

        if(newValue?.length as number > 0) {
          setValue('perusahaan.id', newValue);
        }
        else {
          resetField('perusahaan.id');
        }
      },
      []
    );

    const _onHandleOnChangeTextFieldNpwpBadan = useCallback(
      (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        let hasilParse = parseNpwp(newValue||'');
        setNpwpPerusahaan(newValue||'');

        if(hasilParse?.length as number > 0) {
          setValue('perusahaan.id', hasilParse);
        }
        else {
          resetField('perusahaan.id');
        }
      },
      []
    );

    const _onHandleOnChangeTextFieldNamaPerusahaan = useCallback(
      (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setNamaTFValue(newValue || '');
        setValue('perusahaan.nama', newValue!);
      },
      []
    );

    const onSubmit: SubmitHandler<IRegisterPerusahaan> = data => console.log(data);
    const onError: SubmitErrorHandler<IRegisterPerusahaan> = error => console.log(error);
    
    return (
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        isModeless={false}
        containerClassName={contentStyles.container}
        dragOptions={dragOptions}
      >
        <div className={contentStyles.header}>
          <h2 className={contentStyles.heading} id={titleId}>
          {title}
          </h2>
          <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={hideModal}
          />
        </div>
        <div className={contentStyles.body}>
          <Controller 
            name="perusahaan.modelPerizinan"
            control={control}
            render={
              ({
                field: {onChange, onBlur}, 
                fieldState: { error }
              }) => (
                  <Dropdown
                    label="Status OSS"
                    placeholder="--Pilih--"
                    options={optionsModelPerizinan != undefined ? optionsModelPerizinan:[]}
                    onChange={_onHandleOnChangeModelPerizinanDropDown}
                    selectedKey={selectedKeyModelPerizinan != undefined ? selectedKeyModelPerizinan:null}
                    errorMessage={error && 'harus diisi'}
                  />
              )}
          />
          <Controller 
            name="perusahaan.skalaUsaha"
            control={control}
            render={
              ({
                field: {onChange, onBlur}, 
                fieldState: { error }
              }) => (
                  <Dropdown
                    label="Skala usaha"
                    placeholder="--Pilih--"
                    options={ optionsSkalaUsaha != undefined ? optionsSkalaUsaha:[]}
                    onChange={_onHandleOnChangeSkalaUsahaDropDown}
                    selectedKey={selectedKeySkalaUsaha != undefined ? selectedKeySkalaUsaha:null}
                    disabled={selectedKeyModelPerizinan == undefined ? true:false}
                    errorMessage={error && 'harus diisi'}
                  />
              )}
          />
          <Dropdown
            label="Jenis pelaku usaha"
            placeholder="--Pilih--"
            options={ optionsKategoriPelakuUsaha != undefined ? optionsKategoriPelakuUsaha:[]}
            onChange={_onHandleOnChangeKategoriPelakuUsahaDropDown}
            selectedKey={selectedKeyKategoriPelakuUsaha != undefined ? selectedKeyKategoriPelakuUsaha:null}
            disabled={selectedKeySkalaUsaha == undefined ? true:false}
          />
          <Controller 
            name="perusahaan.pelakuUsaha"
            control={control}
            render={
              ({
                field: {onChange}, 
                fieldState: { error }
              }) => (
                  <Dropdown
                    label="Pelaku usaha"
                    placeholder="--Pilih--"
                    options={ optionsPelakuUsaha != undefined ? optionsPelakuUsaha:[]}
                    onChange={_onHandleOnChangePelakuUsahaDropDown}
                    selectedKey={selectedKeyPelakuUsaha != undefined ? selectedKeyPelakuUsaha:null}
                    errorMessage={error && 'harus diisi'}
                    disabled={selectedKeyKategoriPelakuUsaha == undefined ? true:false}
                  />
              )}
          />
          <Controller 
            name="perusahaan.id"
            control={control}
            render={
              ({
                field: {onChange}, 
                fieldState: { error }
              }) => {
                if(selectedKeyKategoriPelakuUsaha ==  '0101' || selectedKeyKategoriPelakuUsaha ==  '0201') { //pribadi
                  return <TextField 
                    label="NPWP pribadi"
                    placeholder="isi dengan nik sesuai dengan ktp"
                    value={npwpPerusahaan != undefined ? npwpPerusahaan:''}
                    onChange={_onHandleOnChangeTextFieldNpwpPribadi}
                    disabled={selectedKeyPelakuUsaha == undefined ? true:false}
                    errorMessage={error && (error?.type == "invalid_type"? 'Harus diisi':error.message)}
                  />;                  
                }
                else {
                  return <MaskedTextField 
                    label='NPWP badan'
                    mask="99.999.999.9-999.999"
                    value={npwpPerusahaan != undefined ? npwpPerusahaan:''}
                    onChange={_onHandleOnChangeTextFieldNpwpBadan}
                    disabled={selectedKeyPelakuUsaha == undefined ? true:false}
                    errorMessage={error && (error?.type == "invalid_type"? 'Harus diisi':error.message)}
                  />
                }                            
              }
            }
          />
          <Controller 
            name="perusahaan.nama"
            control={control}
            render={
              ({
                field: {onChange}, 
                fieldState: { error }
              }) => (
                <TextField 
                  label="Nama perusahaan"
                  prefix={badanUsaha == undefined ? "": `${badanUsaha}.`}
                  value={namaTFValue}
                  onChange={_onHandleOnChangeTextFieldNamaPerusahaan}
                  disabled={npwpPerusahaan == undefined ? true:false}
                  errorMessage={error && 'Harus diisi'}
                />
              )}
          />              
          <PrimaryButton 
            style={{marginTop: 16, width: '100%'}}
            text="Simpan" 
            onClick={handleSubmit(onSubmit, onError)}
          />
        </div>
      </Modal>
    );
}
