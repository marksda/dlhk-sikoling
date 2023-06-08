import { ComboBox, ContextualMenu, FontWeights, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ISelectableOption, IconButton, Modal, PrimaryButton, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useMemo } from "react";
import { z } from "zod";
import { AutorityPerusahaanSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllRegisterPerusahaanQuery } from "../../features/perusahaan/register-perusahaan-api-slice";
import { invertParseNpwp } from "../../features/config/helper-function";
import { useGetAllAuthorisasiQuery } from "../../features/security/authorization-api-slice";

interface IFormulirAutorityPerusahaanFluentUIProps {
  title: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
};
type FormSchemaType = z.infer<typeof AutorityPerusahaanSchema>;

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
const basicStyles: Partial<IComboBoxStyles> = { root: { width: 400 } };

export const FormulirAutorityPerusahaan: FC<IFormulirAutorityPerusahaanFluentUIProps> = ({title, isModalOpen, showModal, hideModal}) => { 
    //local state
    const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
    const titleId = useId('title');
    const {
      handleSubmit,
      control,
      resetField} = useForm<FormSchemaType>({
      resolver: zodResolver(AutorityPerusahaanSchema),
    });

    const { data: postsRegisterPerusahaan, isLoading: isLoadingPostsPerusahaan } = useGetAllRegisterPerusahaanQuery({
      pageNumber: 1,
      pageSize: 25,
      filters: [],
      sortOrders: [
          {
              fieldName: 'nama',
              value: 'ASC'
          },
      ],
    });
    const { data: postsAuthority, isLoading: isLoadingPostsAuthority } = useGetAllAuthorisasiQuery({
      pageNumber: 1,
      pageSize: 25,
      filters: [],
      sortOrders: [
          {
              fieldName: 'nama',
              value: 'ASC'
          },
      ],
    });
    

    const optionsPerusahaan: IComboBoxOption[]|undefined = useMemo(
      () => (
        postsRegisterPerusahaan?.map((item):IComboBoxOption => {
                return {
                  key: item.id as string,
                  text: `${item.perusahaan?.pelakuUsaha != undefined ? item.perusahaan?.pelakuUsaha?.singkatan+'. ':''}${item.perusahaan?.nama}`,
                  data: item
                };
              })
      ),
      [postsRegisterPerusahaan]
    );

    const optionsPengakses: IComboBoxOption[]|undefined = useMemo(
      () => (
        postsAuthority?.map((item):IComboBoxOption => {
                return {
                  key: item.id as string,
                  text: item.userName as string,
                  data: item
                };
              })
      ),
      [postsAuthority]
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

    const onSubmit: SubmitHandler<FormSchemaType> = data => console.log(data);
    const onError: SubmitErrorHandler<FormSchemaType> = error => console.log(error);

    const onRenderOption = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
      return <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>
              <span><b>
                  {
                  item!.data!.perusahaan.pelakuUsaha !== undefined ?
                  `${item!.data.perusahaan?.pelakuUsaha?.singkatan}. ${item?.data.perusahaan?.nama}` :
                  `${item!.data.perusahaan?.nama}`
                  }
              </b></span><br />  
              <span>
                  {
                      item!.data.perusahaan?.id != undefined ?
                      invertParseNpwp(item!.data.perusahaan?.id) : `-`
                  }
              </span><br />
              <span>
                  {
                  item!.data.perusahaan?.alamat != undefined ? 
                  item!.data.perusahaan?.alamat.keterangan != undefined ? item!.data.perusahaan?.alamat.keterangan:null:null
                  }
                  {
                  item!.data.perusahaan?.alamat != undefined ? 
                  item!.data.perusahaan?.alamat.desa != undefined ? `, ${item!.data.perusahaan?.alamat.desa.nama}`:null:null
                  }                            
              </span><br />
              <span>
                  {
                      item!.data.perusahaan?.alamat != undefined ? 
                      item!.data.perusahaan?.alamat.kecamatan != undefined ? `${item!.data.perusahaan?.alamat.kecamatan.nama}`:null:null
                  }
                  {
                  item!.data.perusahaan?.alamat != undefined ? 
                  item!.data.perusahaan?.alamat.kabupaten != undefined ? `, ${item!.data.perusahaan?.alamat.kabupaten.nama}`:null:null
                  }
              </span>
              <span>
                  {
                  item!.data.perusahaan?.alamat != undefined ? 
                  item!.data.perusahaan?.alamat.propinsi != undefined ? `, ${item!.data.perusahaan?.alamat.propinsi.nama}`:null:null
                  }
              </span>
            </div>;      
    };

    const onRenderOptionPengakses = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
      return <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>
              <span><b>
                  {
                  item?.data.userName !== undefined ?item.data.userName:'-'
                  }
              </b></span><br />  
              <span>{item?.data.person.nama != undefined ? item.data.person.nama:'-'}</span><br />
              <span>{item?.data.person.nik != undefined ? item.data.person.nik:'-'}</span><br />
              <span>
                  {
                      item?.data.person.alamat != undefined ? 
                      item?.data.person.alamat.keterangan != undefined ? item.data.person.alamat.keterangan:null:null
                  }
                  {
                      item?.data.person.alamat != undefined ? 
                      item.data.person.alamat.desa != undefined ? `, ${item.data.person.alamat.desa.nama}`:null:null
                  }
              </span><br />
              <span>                            
                  {
                      item?.data.person.alamat != undefined ? 
                      item?.data.person.alamat.kecamatan != undefined ? item.data.person.alamat.kecamatan.nama:null:null
                  }
                  {
                      item?.data.person.alamat != undefined ? 
                      item?.data.person.alamat.kabupaten != undefined ? `, ${item.data.person.alamat.kabupaten.nama}`:null:null
                  }
                  {
                      item?.data.person.alamat != undefined ? 
                      item?.data.person.alamat.propinsi != undefined ? `, ${item.data.person.alamat.propinsi.nama}`:null:null
                  }
              </span>
            </div>;      
    };
    
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
            name="registerPerusahaan"
            control={control}
            render={
              ({
                field: {onChange, onBlur}, 
                fieldState: { error }
              }) => (
                  <ComboBox
                    label="Perusahaan"
                    allowFreeform
                    options={optionsPerusahaan != undefined ? optionsPerusahaan:[]}
                    useComboBoxAsMenuWidth={true}
                    onRenderOption={onRenderOption}         
                    styles={basicStyles}           
                    errorMessage={error && 'harus diisi'}
                  />
              )}
          />
          <Controller 
            name="autority"
            control={control}
            render={
              ({
                field: {onChange, onBlur}, 
                fieldState: { error }
              }) => (
                  <ComboBox
                    label="Pengakses"
                    allowFreeform
                    options={optionsPengakses != undefined ? optionsPengakses:[]}
                    useComboBoxAsMenuWidth={true}
                    onRenderOption={onRenderOptionPengakses}         
                    styles={basicStyles}           
                    errorMessage={error && 'harus diisi'}
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
