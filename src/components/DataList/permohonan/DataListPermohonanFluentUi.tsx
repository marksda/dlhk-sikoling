import { DetailsList, DetailsListLayoutMode, IColumn, IStackTokens, Link, mergeStyleSets, SelectionMode } from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { baseRestAPIUrl } from "../../../features/config/config";
import { IDokumenAktaPendirian } from "../../../features/dokumen/dokumen-akta-pendirian-slice";
import { IDokumenNibOss } from "../../../features/dokumen/dokumen-nib-oss-slice";
import { ILampiranSuratArahan } from "../../../features/dokumen/lampiran-surat-arahan-api-slice";
import { useDownloadFileDokumenWithSecurityQuery } from "../../../features/dokumen/register-dokumen-api-slice";
import { IRegisterDokumen } from "../../../features/dokumen/register-dokumen-slice";
import { IRekomendasiDPLH } from "../../../features/dokumen/rekomendasi-dplh-api-slice";
import { IRekomendasiUKLUPL } from "../../../features/dokumen/rekomendasi-ukl-upl-api-slice";
import { ISuratArahan } from "../../../features/dokumen/surat-arahan-api-slice";
import { IListItemRegisterPermohonan, ISubFormDetailPermohonanProps } from "./InterfaceDataListPermohonan";

const _columns: IColumn[] = [    
    { 
        key: 'k1', 
        name: 'Tanggal Pengajuan', 
        fieldName: 'tanggalRegistrasi', 
        minWidth: 100, 
        maxWidth: 100, 
        isRowHeader: true,
        isResizable: true,
        data: 'number',
        isPadded: true,
    },
    { 
        key: 'k2', 
        name: 'Pemrakarsa', 
        minWidth: 100, 
        maxWidth: 200, 
        isResizable: true, 
        data: 'string',
        onRender: (item: IListItemRegisterPermohonan) => {
            return (
                <span>
                    {
                    item.registerPerusahaan?.perusahaan?.pelakuUsaha !== undefined ?
                     `${item.registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${item.registerPerusahaan?.perusahaan?.nama}` : `${item.registerPerusahaan?.perusahaan?.nama}`
                    }
                </span>
            );
        },
        isPadded: true,
    },
    { 
        key: 'k3', 
        name: 'Jenis Permohonan', 
        minWidth: 100, 
        maxWidth: 200, 
        isResizable: true,
        data: 'string',
        onRender: (item: IListItemRegisterPermohonan) => {
            return (
                <span>
                    {
                        item.kategoriPermohonan?.nama
                    }
                </span>
            );
        },
        isPadded: true,
    },
    { 
        key: 'k4',
        name: 'Dokumen Pendukung', 
        minWidth: 100, 
        maxWidth: 200, 
        isResizable: true,
        onRender: (item: IListItemRegisterPermohonan) => {
            return (
                <>
                    <div className={contentStyles.mainTitle}>Jumlah Dokumen : {item.daftarDokumenSyarat?.length}</div>  
                    {
                        item.daftarDokumenSyarat?.map((dataRegisterDokumen:IRegisterDokumen, index) => {
                            let dokumen = null;
                            if(dataRegisterDokumen.dokumen?.id == '010401') {
                                dokumen = dataRegisterDokumen.dokumen as ISuratArahan;
                                return (
                                    <>
                                        <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                        <div className={contentStyles.contenItemDok}>
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                            <Link 
                                                href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                target="_blank"
                                                underline
                                            >
                                                Download dokumen
                                            </Link>
                                        </div>
                                    </>                                    
                                );
                            }
                            else if(dataRegisterDokumen.dokumen?.id == '010402') {
                                dokumen = dataRegisterDokumen.dokumen as ILampiranSuratArahan;
                                return (
                                    <>
                                        <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                        <div className={contentStyles.contenItemDok}>
                                            <span>Nomor surat arahan: {dokumen?.noSuratArahan}</span><br />
                                            <Link 
                                                href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                target="_blank"
                                                underline
                                            >
                                                Download dokumen
                                            </Link> 
                                        </div>
                                    </>                                    
                                );
                            }
                            else if(dataRegisterDokumen.dokumen?.id == '010101') {
                                dokumen = dataRegisterDokumen.dokumen as IDokumenAktaPendirian;
                                return (
                                    <>
                                        <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                        <div className={contentStyles.contenItemDok}>
                                            <span>Nomor: {dokumen?.nomor}</span><br />
                                            <span>notaris: {dokumen?.namaNotaris}</span><br />
                                            <Link 
                                                href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                target="_blank"
                                                underline
                                            >
                                                Download dokumen
                                            </Link> 
                                        </div>
                                    </>                                    
                                );
                            }
                            else if(dataRegisterDokumen.dokumen?.id == '010404') {
                                dokumen = dataRegisterDokumen.dokumen as IRekomendasiUKLUPL;
                                return (
                                    <>
                                        <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                        <div className={contentStyles.contenItemDok}>
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br /> 
                                            <Link 
                                                href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                target="_blank"
                                                underline
                                            >
                                                Download dokumen
                                            </Link>
                                        </div>
                                    </>                                    
                                );
                            }
                            else if(dataRegisterDokumen.dokumen?.id == '010406') {
                                dokumen = dataRegisterDokumen.dokumen as IRekomendasiDPLH;
                                return (
                                    <>
                                        <span>- {dokumen?.nama}</span><br /><div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                        <div className={contentStyles.contenItemDok}>
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                            <Link 
                                                href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                target="_blank"
                                                underline
                                            >
                                                Download dokumen
                                            </Link>
                                        </div>
                                    </>                                    
                                );
                            }
                            else if(dataRegisterDokumen.dokumen?.id == '010301') {
                                dokumen = dataRegisterDokumen.dokumen as IDokumenNibOss;
                                return (
                                    <>
                                        <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                        <div className={contentStyles.contenItemDok}>
                                            <span>Nomor: {dokumen?.nomor}</span><br />
                                            <span>perihal: {dokumen?.tanggal}</span><br />
                                            <Link 
                                                href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                target="_blank"
                                                underline
                                            >
                                                Download dokumen
                                            </Link>
                                        </div>
                                    </>                                    
                                );
                            }
                        })
                    }                  
                </>
            );
        },
        isPadded: true,
    },
    { 
        key: 'k5', 
        name: 'Status Permohonan', 
        minWidth: 100, 
        maxWidth: 200, 
        isResizable: true,
        onRender: (item: IListItemRegisterPermohonan) => {
            return (
                <span>{item.statusTahapPemberkasan?.nama == 'Selesai' ? `${item.statusTahapPemberkasan?.keterangan}` : `${item.statusTahapPemberkasan?.nama} - ${item.statusTahapPemberkasan?.keterangan}`}</span>
            );
        },
        isPadded: true,
    },
];
const contentStyles = mergeStyleSets({
    contenItemDok: {
        marginLeft: 12,
        marginBottom: 4,
    },
    title: {
        fontWeight: 'bold',
    },
    mainTitle: {
        marginBottom: 4,
        fontWeight: 'bold',
    }
});

const _getKey = (item: any, index?: number): string => {
    return item.key;
};

export const DataListPermohonanFluentUI: FC<ISubFormDetailPermohonanProps> = ({dataPermohonan}) => {
    //localState
    // const [namaFile, setNamaFile] = useState<string>('');
    // const [npwpPerusahaan, setNpwpPerusahaan] = useState<string>('');
    // const [skipDownload, setSkipDownload] = useState<boolean>(true);
    //rtk query perusahaan variable hook
    // const {data: donwloadFile, error: ErrorFetchDownloadFile} = useDownloadFileDokumenWithSecurityQuery(
    //     {
    //         namaFile,
    //         npwpPerusahaan
    //     }, 
    //     {
    //         skip: skipDownload
    //     }
    // );


    // useEffect(
    //     () => {
    //         console.log(donwloadFile);
    //     },
    //     [donwloadFile]
    // )

    // const handleClickOnLink = useCallback(
    //     (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLElement>) => {
    //         var btnElemen = event.target as HTMLButtonElement;     
    //         var split_text = btnElemen.ariaLabel?.split('**') as string[];
    //         setNamaFile(split_text[1]);
    //         setNpwpPerusahaan(split_text[0]);
    //         setSkipDownload(false);
    //     },
    //     []
    // );

    // const handleRenderItemColumn = useCallback(
    //     (item: IListItemRegisterPermohonan, index: number|undefined, column: IColumn|undefined) => {
    //         // const fieldContent = item[column!.fieldName as keyof IListItemPerusahaan] as string;
    //         switch (column!.key) {
    //             case 'k1':
    //                 return (
    //                     <span>
    //                       {item.tanggalRegistrasi}
    //                     </span>
    //                 );    
    //             case 'k2':
    //                 return (
    //                     <span>
    //                         {item.registerPerusahaan?.perusahaan?.nama}
    //                     </span>
    //                 ); 
    //             case 'k3':
    //                 return (
    //                     <span>
    //                         {item.kategoriPermohonan?.nama}
    //                     </span>
    //                 );  
    //             case 'k5':
    //                 return (
    //                     <span>
    //                         {
    //                             item.statusTahapPemberkasan?.nama == 'Selesai' ? `${item.statusTahapPemberkasan?.keterangan}` : `${item.statusTahapPemberkasan?.nama} - ${item.statusTahapPemberkasan?.keterangan}`
    //                         }
    //                     </span>
    //                 ); 
    //             default:
    //                 return(
    //                     <>
    //                     <div className={contentStyles.mainTitle}>Jumlah Dokumen : {item.daftarDokumenSyarat?.length}</div>                    
    //                     {
    //                         item.daftarDokumenSyarat?.map((dataRegisterDokumen:IRegisterDokumen, index) => {
                                // let dokumen = null;
                                // if(dataRegisterDokumen.dokumen?.id == '010401') {
                                //     dokumen = dataRegisterDokumen.dokumen as ISuratArahan;
                                //     return (
                                //         <>
                                //             <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                //             <div className={contentStyles.contenItemDok}>
                                //                 <span>Nomor: {dokumen?.noSurat}</span><br />
                                //                 <span>perihal: {dokumen?.perihalSurat}</span><br />
                                //                 <Link 
                                //                     href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                //                     target="_blank"
                                //                     underline
                                //                 >
                                //                     Download dokumen
                                //                 </Link>
                                //             </div>
                                //         </>                                    
                                //     );
                                // }
                                // else if(dataRegisterDokumen.dokumen?.id == '010402') {
                                //     dokumen = dataRegisterDokumen.dokumen as ILampiranSuratArahan;
                                //     return (
                                //         <>
                                //             <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                //             <div className={contentStyles.contenItemDok}>
                                //                 <span>Nomor surat arahan: {dokumen?.noSuratArahan}</span><br />
                                //                 <Link 
                                //                     href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                //                     target="_blank"
                                //                     underline
                                //                 >
                                //                     Download dokumen
                                //                 </Link> 
                                //             </div>
                                //         </>                                    
                                //     );
                                // }
                                // else if(dataRegisterDokumen.dokumen?.id == '010101') {
                                //     dokumen = dataRegisterDokumen.dokumen as IAktaPendirian;
                                //     return (
                                //         <>
                                //             <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                //             <div className={contentStyles.contenItemDok}>
                                //                 <span>Nomor: {dokumen?.nomor}</span><br />
                                //                 <span>notaris: {dokumen?.namaNotaris}</span><br />
                                //                 <Link 
                                //                     href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                //                     target="_blank"
                                //                     underline
                                //                 >
                                //                     Download dokumen
                                //                 </Link> 
                                //             </div>
                                //         </>                                    
                                //     );
                                // }
                                // else if(dataRegisterDokumen.dokumen?.id == '010404') {
                                //     dokumen = dataRegisterDokumen.dokumen as IRekomendasiUKLUPL;
                                //     return (
                                //         <>
                                //             <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                //             <div className={contentStyles.contenItemDok}>
                                //                 <span>Nomor: {dokumen?.noSurat}</span><br />
                                //                 <span>perihal: {dokumen?.perihalSurat}</span><br /> 
                                //                 <Link 
                                //                     href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                //                     target="_blank"
                                //                     underline
                                //                 >
                                //                     Download dokumen
                                //                 </Link>
                                //             </div>
                                //         </>                                    
                                //     );
                                // }
                                // else if(dataRegisterDokumen.dokumen?.id == '010406') {
                                //     dokumen = dataRegisterDokumen.dokumen as IRekomendasiDPLH;
                                //     return (
                                //         <>
                                //             <span>- {dokumen?.nama}</span><br /><div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                //             <div className={contentStyles.contenItemDok}>
                                //                 <span>Nomor: {dokumen?.noSurat}</span><br />
                                //                 <span>perihal: {dokumen?.perihalSurat}</span><br />
                                //                 <Link 
                                //                     href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                //                     target="_blank"
                                //                     underline
                                //                 >
                                //                     Download dokumen
                                //                 </Link>
                                //             </div>
                                //         </>                                    
                                //     );
                                // }
                                // else if(dataRegisterDokumen.dokumen?.id == '010301') {
                                //     dokumen = dataRegisterDokumen.dokumen as IDokumenNibOss;
                                //     return (
                                //         <>
                                //             <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                //             <div className={contentStyles.contenItemDok}>
                                //                 <span>Nomor: {dokumen?.nomor}</span><br />
                                //                 <span>perihal: {dokumen?.tanggal}</span><br />
                                //                 <Link 
                                //                     href={`${baseRestAPIUrl}files/nosecure/dok/${item.registerPerusahaan?.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                //                     target="_blank"
                                //                     underline
                                //                 >
                                //                     Download dokumen
                                //                 </Link>
                                //             </div>
                                //         </>                                    
                                //     );
                                // }
    //                         })
    //                     }
    //                     </>
    //                 );
    //         }
    //     },
    //     []
    // );

    return dataPermohonan != null ?
            <DetailsList
                items={dataPermohonan}
                columns={_columns}
                setKey="none"
                getKey={_getKey}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                isHeaderVisible={true}
            />:null;     
    
};