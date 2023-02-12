import { DetailsList, DetailsListLayoutMode, IColumn, IStackTokens, Link, mergeStyleSets, SelectionMode } from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { baseRestAPIUrl } from "../../../features/config/config";
import { IAktaPendirian } from "../../../features/dokumen/akta-pendirian-api-slice";
import { IDokumenNibOss } from "../../../features/dokumen/dokumen-nib-oss-slice";
import { ILampiranSuratArahan } from "../../../features/dokumen/lampiran-surat-arahan-api-slice";
import { useDownloadFileDokumenWithSecurityQuery } from "../../../features/dokumen/register-dokumen-api-slice";
import { IRegisterDokumen } from "../../../features/dokumen/register-dokumen-slice";
import { IRekomendasiDPLH } from "../../../features/dokumen/rekomendasi-dplh-api-slice";
import { IRekomendasiUKLUPL } from "../../../features/dokumen/rekomendasi-ukl-upl-api-slice";
import { ISuratArahan } from "../../../features/dokumen/surat-arahan-api-slice";
import { IListItemRegisterPermohonan, ISubFormDetailPermohonanProps } from "./InterfaceDataListPermohonan";

const _columns = [    
    { key: 'c1', name: 'Tanggal Pengajuan', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c2', name: 'Pemrakarsa', fieldName: 'pemrakarsa', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Jenis Permohonan', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Dokumen Pendukung', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c5', name: 'Status Permohonan', fieldName: 'status', minWidth: 100, maxWidth: 200, isResizable: true },
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

export const DataListPermohonanFluentUI: FC<ISubFormDetailPermohonanProps> = ({dataPermohonan}) => {
    //localState
    const [namaFile, setNamaFile] = useState<string>('');
    const [npwpPerusahaan, setNpwpPerusahaan] = useState<string>('');
    const [skipDownload, setSkipDownload] = useState<boolean>(true);
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

    console.log(dataPermohonan);


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

    const handleRenderItemColumn = useCallback(
        (item: IListItemRegisterPermohonan, index: number|undefined, column: IColumn|undefined) => {
            // const fieldContent = item[column!.fieldName as keyof IListItemPerusahaan] as string;
            switch (column!.key) {
                case 'c1':
                    return (
                        <span>
                          {item.tanggalRegistrasi}
                        </span>
                    );    
                case 'c2':
                    return (
                        <span>
                            {item.registerPerusahaan?.perusahaan?.nama}
                        </span>
                    ); 
                case 'c3':
                    return (
                        <span>
                            {item.kategoriPermohonan?.nama}
                        </span>
                    );  
                case 'c5':
                    return (
                        <span>
                            {
                                item.statusTahapPemberkasan?.nama == 'Selesai' ? `${item.statusTahapPemberkasan?.keterangan}` : `${item.statusTahapPemberkasan?.nama} - ${item.statusTahapPemberkasan?.keterangan}`
                            }
                        </span>
                    ); 
                default:
                    return(
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
                                    dokumen = dataRegisterDokumen.dokumen as IAktaPendirian;
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
            }
        },
        []
    );

    // const _getKey = useCallback(
    //     (item: any, index?: number): string => {
    //         return item.key;
    //     },
    //     []
    // );

    return dataPermohonan != null ?
            <DetailsList
                items={dataPermohonan}
                columns={_columns}
                setKey="none"
                layoutMode={DetailsListLayoutMode.justified}
                onRenderItemColumn={handleRenderItemColumn}
                selectionMode={SelectionMode.none}
            />:null;     
    
};