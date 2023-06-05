import { ContextualMenu, Dropdown, FontWeights, IDragOptions, IDropdownOption, IIconProps, IconButton, MaskedTextField, Modal, PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { z } from "zod";
import { PerusahaanSchema, RegisterPerusahaanSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IModelPerizinan, useGetAllModelPerizinanQuery } from "../../features/perusahaan/model-perizinan-api-slice";
import { ISkalaUsaha, useGetAllSkalaUsahaQuery } from "../../features/perusahaan/skala-usaha-api-slice";
import { useGetDaftarPelakuUsahaByFiltersQuery } from "../../features/perusahaan/pelaku-usaha-api-slice";
import find from "lodash.find";
import { IPelakuUsaha } from "../../features/perusahaan/pelaku-usaha-slice";
import { IKategoriPelakuUsaha } from "../../features/perusahaan/kategori-pelaku-usaha-slice";
import { parseNpwp } from "../../features/config/helper-function";


interface IFormulirPerusahaanFluentUIProps {
  title: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
};
type FormSchemaType = z.infer<typeof RegisterPerusahaanSchema>;

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

export const FormulirPerusahaan: FC<IFormulirPerusahaanFluentUIProps> = ({title, isModalOpen, showModal, hideModal}) => { 
    //local state
    const [selectedSkalaUsaha, setSelectedSkalaUsaha] = useState<IDropdownOption|null|undefined>(undefined);   
    const [selectedPelakuUsaha, setSelectedPelakuUsaha] = useState<IDropdownOption|null|undefined>(undefined);
    const [kategoriPelakuUsaha, setKategoriPelakuUsaha] = useState<IKategoriPelakuUsaha|undefined>(undefined);
    const [npwpTerparsing, setNpwpTerparsing] = useState<string|undefined>(undefined);
    const [badanUsaha, setBadanUsaha] = useState<string|undefined>(undefined); 
    const [namaTFValue, setNamaTFValue] = useState<string>('');  
    const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
    const titleId = useId('title');
    const {
      handleSubmit,
      control,
      resetField
    } = useForm<FormSchemaType>({
      resolver: zodResolver(RegisterPerusahaanSchema),
    });

    const { data: postsModelPerizinan, isLoading: isLoadingPosts } = useGetAllModelPerizinanQuery({
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
    const { data: postsSkalaUsaha, isLoading: isLoadingPostsSkalaUsaha } = useGetAllSkalaUsahaQuery({
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
        pageSize: 0,
        filters: [
          {
            fieldName: 'skala_usaha',
            value: selectedSkalaUsaha?.key as string
          },
        ],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
      },
      {
        skip: selectedSkalaUsaha == undefined ? true:false
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

    const _onChangeNamaTF = useCallback(
      (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setNamaTFValue(newValue || '');
      },
      []
    );

    const onSubmit: SubmitHandler<FormSchemaType> = data => console.log(data);
    const onError: SubmitErrorHandler<FormSchemaType> = error => console.log(error);
    
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
                    options={
                      postsModelPerizinan != undefined ? postsModelPerizinan?.map(
                            (t) => ({
                                key: t.id!, 
                                text: `${t.singkatan}`
                            })
                        ) : []
                    }
                    onChange={
                      (e, i) => {
                        onChange(find(postsModelPerizinan, (t:IModelPerizinan) => t.id == i?.key));
                      }
                    }
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
                    options={
                      postsSkalaUsaha != undefined ? postsSkalaUsaha?.map(
                            (t) => ({
                                key: t.id!, 
                                text: `${t.singkatan}`
                            })
                        ) : []
                    }
                    onChange={
                      (e, i) => {
                        setSelectedSkalaUsaha(i);
                        setSelectedPelakuUsaha(undefined);
                        setBadanUsaha(undefined);
                        resetField("perusahaan.pelakuUsaha");
                        onChange(find(postsSkalaUsaha, (t:ISkalaUsaha) => t.id == i?.key));
                      }
                    }
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
                    options={
                      postsPelakuUsaha != undefined ? postsPelakuUsaha?.map(
                            (t) => ({
                                key: t.id!, 
                                text: `${t.nama} (${t.singkatan})`
                            })
                        ) : []
                    }
                    onChange={
                      (e, i) => {
                        let tmp:IPelakuUsaha|undefined = find(postsPelakuUsaha, (t:IPelakuUsaha) => t.id == i?.key);
                        setKategoriPelakuUsaha(tmp?.kategoriPelakuUsaha as IKategoriPelakuUsaha);
                        setSelectedPelakuUsaha(i);
                        setBadanUsaha(tmp?.singkatan as string);
                        onChange(tmp);
                      }
                    }
                    defaultSelectedKey={selectedPelakuUsaha == undefined ? null:selectedPelakuUsaha.key}
                    errorMessage={error && 'harus diisi'}
                    disabled={selectedSkalaUsaha == undefined ? true:false}
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
