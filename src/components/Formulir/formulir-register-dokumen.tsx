import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ISelectableOption,  IconButton, Modal , Stack, find, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { useGetDaftarDataRegisterPerusahaanQuery, useGetDaftarDataDokumenQuery } from "../../features/repository/service/sikoling-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { invertParseNpwp } from "../../features/config/helper-function";
import { IDokumen } from "../../features/entity/dokumen";
import { IDokumenAktaPendirian } from "../../features/entity/dokumen-akta-pendirian";
import { FormulirRegisterDokumenAktaPendirian } from "./formulir-dokumen-akta-pendirian";

interface IFormulirRegisterDokumenFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  hideModal: () => void;
  dataLama?: IRegisterDokumen<any>;
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
const basicComboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 400 } };
const stackTokens = { childrenGap: 8 };

export const FormulirRegisterDokumen: FC<IFormulirRegisterDokumenFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
  // local state
  // const [idRegisterDokumenTextFieldValue, setIdDokumenTextFieldValue] = useState<string|undefined>(dataLama != undefined ? dataLama.dokumen?.id!:'');
  const [selectedKeyRegisterPerusahaan, setSelectedKeyRegisterPerusahaan] = useState<string|undefined>(dataLama != undefined ? dataLama.registerPerusahaan?.id!:undefined);
  const [selectedKeyDokumen, setSelectedKeyDokumen] = useState<string|undefined>(dataLama != undefined ? dataLama.dokumen?.id!:undefined);  
  const [queryRegisterPerusahaanParams, setQueryRegisterPerusahaanParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 50,
    filters: dataLama != undefined ? [{
      fieldName: 'nama',
      value: dataLama.registerPerusahaan?.perusahaan?.nama!
    }]:[],
    sortOrders: [
      {
          fieldName: 'nama',
          value: 'ASC'
      },
    ],
  });
  const [queryDokumenParams, setQueryDokumenParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 100,
    filters: dataLama != undefined ? [{
      fieldName: 'nama',
      value: (dataLama.dokumen as IDokumen).nama!
    }]:[],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  // const [queryJabatanParams, setQueryJabatanParams] = useState<IQueryParamFilters>({
  //   pageNumber: 1,
  //   pageSize: 100,
  //   filters: [],
  //   sortOrders: [
  //       {
  //           fieldName: 'nama',
  //           value: 'ASC'
  //       },
  //   ],
  // });
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');
  //ref component
  const comboBoxRegisterPerusahaanRef = useRef<IComboBox>(null);
  const comboBoxDokumenRef = useRef<IComboBox>(null);
  // rtk query
  const { data: postsRegisterPerusahaan, isLoading: isLoadingPostsRegisterPerusahaan } = useGetDaftarDataRegisterPerusahaanQuery(queryRegisterPerusahaanParams);
  const { data: postsDokumen, isLoading: isLoadingPostsDokumen } = useGetDaftarDataDokumenQuery(queryDokumenParams);

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

  const optionsRegisterPerusahaan: IComboBoxOption[]|undefined = useMemo(
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

  const optionsDokumen: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsDokumen?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsDokumen]
  );

//   const kontenFormulirDokumen = useMemo(
//     () => {
//         let konten = null;        
//         if(selectedKeyDokumen != undefined && selectedKeyRegisterPerusahaan != undefined) {         
//           switch (selectedKeyDokumen) {
//             case '010101':
//             konten = 
//               <FormulirRegisterDokumenAktaPendirian 
//                 mode={mode} 
//                 dokumen={find(postsDokumen!, (i) => i.id == selectedKeyDokumen) as IDokumenAktaPendirian}
//                 registerPerusahaan={find(postsRegisterPerusahaan!, (i) => i.id == selectedKeyRegisterPerusahaan)}
//                 dataLama={dataLama}/>;
//             break;            
//           default:
//             break;
//           }
//         }
//         console.log('konten dokumwn dipanggil');
//         return konten;
//     },
//     [selectedKeyDokumen, selectedKeyRegisterPerusahaan, postsDokumen, postsRegisterPerusahaan, dataLama]
// );

  const _handleOnDismissed = useCallback(
    () => {
      setDisableForm(false);
    },
    []
  );

  const _onRenderRegisterPerusahaanOption = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
    return item?.data != undefined ?
        <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>
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
        </div>:null;      
  };

  const _onInputComboBoxRegisterPerusahaanValueChange = useCallback(
    (newValue: string) => {
      if(newValue.length > 2) {
        comboBoxRegisterPerusahaanRef.current?.focus(true);
        setQueryRegisterPerusahaanParams(
            prev => {
                let tmp = cloneDeep(prev);
                let filters = cloneDeep(tmp.filters);
                let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                
                if(newValue != '') {
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'nama',
                            value: newValue
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'nama',
                            value: newValue
                        })
                    }
                }
                else {
                    if(found > -1) {
                        filters?.splice(found, 1);
                    }
                }
                
                tmp.pageNumber = 1;
                tmp.filters = filters;             
                return tmp;
            }
        );
      }
      else if(newValue == '') {
        setQueryRegisterPerusahaanParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;                 
              console.log(found);
              if(found > -1) {
                filters?.splice(found, 1);
              }
              
              tmp.pageNumber = 1;
              tmp.filters = filters;    
              return tmp;
          }
        );
      }
    },
    [comboBoxRegisterPerusahaanRef]
  );

  const _onHandleOnChangeRegisterPerusahaanComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      setSelectedKeyRegisterPerusahaan(option?.key as string);
    },
    [postsRegisterPerusahaan]
  );
  
  const _onInputComboBoxDokumenValueChange = useCallback(
    (newValue: string) => {
      console.log(newValue);
      if(newValue.length > 2) {
        comboBoxDokumenRef.current?.focus(true);
        setQueryDokumenParams(
            prev => {
                let tmp = cloneDeep(prev);
                let filters = cloneDeep(tmp.filters);
                let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                
                if(newValue != '') {
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'nama',
                            value: newValue
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'nama',
                            value: newValue
                        })
                    }
                }
                else {
                    if(found > -1) {
                        filters?.splice(found, 1);
                    }
                }
                
                tmp.pageNumber = 1;
                tmp.filters = filters;             
                return tmp;
            }
        );
      }
      else if(newValue.length == 0) {
        setQueryDokumenParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;                 
              
              if(found > -1) {
                filters?.splice(found, 1);
              }
              
              tmp.pageNumber = 1;
              tmp.filters = filters;             
              return tmp;
          }
        );
      }
    },
    []
  );

  const _onHandleOnChangeDokumenComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        // let dokumen = cloneDeep(postsDokumen?.at(index!));
        // setSelectedDokumen(dokumen);
        // setValue('dokumen', dokumen!);
        setSelectedKeyDokumen(option?.key as string);
      },
      [postsDokumen]
  );
  
  return (
    <Modal
      titleAriaId={titleId}
      isOpen={isModalOpen}
      isModeless={false}
      containerClassName={contentStyles.container}
      dragOptions={dragOptions}
      onDismissed={_handleOnDismissed}
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
        <Stack tokens={stackTokens}> 
          {
            mode == "add" &&
            <Stack.Item>
              <Stack horizontal tokens={stackTokens} grow> 
                <Stack.Item>
                  <ComboBox
                    componentRef={comboBoxRegisterPerusahaanRef}
                    label="Perusahaan"
                    placeholder="ketik minimal 3 abjad untuk menampilkan pilihan"
                    allowFreeform={true}
                    options={optionsRegisterPerusahaan != undefined ? optionsRegisterPerusahaan:[]}
                    selectedKey={selectedKeyRegisterPerusahaan}
                    useComboBoxAsMenuWidth={true}
                    onRenderOption={_onRenderRegisterPerusahaanOption}   
                    onInputValueChange={_onInputComboBoxRegisterPerusahaanValueChange}      
                    styles={basicComboBoxStyles}          
                    onChange={_onHandleOnChangeRegisterPerusahaanComboBox}
                    disabled={disableForm}
                  />
                </Stack.Item> 
                <Stack.Item grow> 
                  <ComboBox
                    componentRef={comboBoxDokumenRef}
                    label="Jenis dokumen"
                    placeholder="ketik minimal 3 abjad untuk menampilkan pilihan"
                    allowFreeform={true}
                    options={optionsDokumen != undefined ? optionsDokumen:[]}
                    selectedKey={selectedKeyDokumen}
                    useComboBoxAsMenuWidth={true}
                    onInputValueChange={_onInputComboBoxDokumenValueChange}      
                    styles={basicComboBoxStyles}           
                    onChange={_onHandleOnChangeDokumenComboBox}
                    disabled={disableForm}
                  />
                </Stack.Item> 
              </Stack>
            </Stack.Item>
          }           
          {
            selectedKeyDokumen == '010101' && selectedKeyRegisterPerusahaan != undefined && (
              <FormulirRegisterDokumenAktaPendirian 
                mode={mode} 
                dokumen={find(postsDokumen!, (i) => i.id == selectedKeyDokumen) as IDokumenAktaPendirian}
                registerPerusahaan={find(postsRegisterPerusahaan!, (i) => i.id == selectedKeyRegisterPerusahaan)}
                dataLama={dataLama}
                closeWindow={hideModal}/>
            )
          }
        </Stack>
      </div>
    </Modal>
  );
}