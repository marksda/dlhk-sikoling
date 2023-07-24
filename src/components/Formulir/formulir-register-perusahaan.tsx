import { ContextualMenu, Dropdown, FontWeights, IComboBoxOption, IDragOptions, IDropdownOption, IIconProps, IconButton, MaskedTextField, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDaftarPelakuUsahaByFiltersQuery } from "../../features/repository/service/pelaku-usaha-api-slice";
import find from "lodash.find";
import { parseNpwp } from "../../features/config/helper-function";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IKategoriPelakuUsaha } from "../../features/entity/kategori-pelaku-usaha";
import { RegisterPerusahaanSchema } from "../../features/schema-resolver/zod-schema";
import { useGetDaftarDataModelPerizinanQuery, useGetDaftarDataSkalaUsahaQuery } from "../../features/repository/service/sikoling-api-slice";
import cloneDeep from "lodash.clonedeep";


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
    const [selectedKeyPelakuUsaha, setSelectedKeyPelakuUsaha] = useState<string|null|undefined>(dataLama != undefined ? dataLama.perusahaan?.pelakuUsaha?.id!:undefined);
    const [kategoriPelakuUsaha, setKategoriPelakuUsaha] = useState<IKategoriPelakuUsaha|undefined>(undefined);
    const [npwpTerparsing, setNpwpTerparsing] = useState<string|undefined>(undefined);
    const [badanUsaha, setBadanUsaha] = useState<string|undefined>(undefined); 
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
          value: 'ASC'
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
    const { data: postsPelakuUsaha, isLoading: isLoadingPostsPelakuUsaha } = useGetDaftarPelakuUsahaByFiltersQuery(
      {
        pageNumber: 1,
        pageSize: 50,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
      },
      {
        skip: selectedKeySkalaUsaha == undefined ? true:false
      }
    );  

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
                  text: item.nama!,
                  data: item
                };
              })
      ),
      [postsSkalaUsaha]
    );

    const optionsPelakuUsaha: IComboBoxOption[]|undefined = useMemo(
      () => (
        postsPelakuUsaha?.map((item):IComboBoxOption => {
                return {
                  key: item.id!,
                  text: item.nama!,
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
          let skalaUsaha = cloneDeep(postsSkalaUsaha?.at(index!));
  
          setValue('perusahaan.skalaUsaha', skalaUsaha!);
          setSelectedKeySkalaUsaha(option?.key as string);
        },
        [postsSkalaUsaha]
    );

    const _onHandleOnChangePelakuUsahaDropDown = useCallback(
      (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
          let pelakuUsaha = cloneDeep(postsPelakuUsaha?.at(index!));
  
          setValue('perusahaan.pelakuUsaha', pelakuUsaha!);
          setSelectedKeyPelakuUsaha(option?.key as string);
        },
        [postsPelakuUsaha]
    );

    const _onChangeNamaTF = useCallback(
      (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setNamaTFValue(newValue || '');
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
                    errorMessage={error && 'harus diisi'}
                  />
              )}
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
                    label="Badan usaha"
                    placeholder="--Pilih--"
                    options={ optionsPelakuUsaha != undefined ? optionsPelakuUsaha:[]}
                    onChange={_onHandleOnChangePelakuUsahaDropDown}
                    selectedKey={selectedKeyPelakuUsaha != undefined ? selectedKeyPelakuUsaha:null}
                    errorMessage={error && 'harus diisi'}
                    disabled={selectedKeySkalaUsaha == undefined ? true:false}
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
              }) => (
                  <MaskedTextField 
                    label={`NPWP ${(kategoriPelakuUsaha?.id ==  '0101' || kategoriPelakuUsaha?.id ==  '0201') ? 'Pribadi':'Badan'}`}
                    mask="99.999.999.9-999.999"
                    onChange={
                      (e, i) => {
                        let hasil = parseNpwp(i as string);
                        if (hasil.length == 15) {
                          setNpwpTerparsing(hasil);
                          onChange(hasil);
                        }
                        else {
                          npwpTerparsing != undefined ? setNpwpTerparsing(undefined):null;
                        }
                      }
                    }
                    disabled={kategoriPelakuUsaha == undefined ? true:false}
                    errorMessage={error && 'Harus diisi'}
                  />          
              )}
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
                  label="Nama"
                  prefix={badanUsaha == undefined ? "": `${badanUsaha}.`}
                  value={namaTFValue}
                  onChange={_onChangeNamaTF}
                  disabled={npwpTerparsing == undefined ? true:false}
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
