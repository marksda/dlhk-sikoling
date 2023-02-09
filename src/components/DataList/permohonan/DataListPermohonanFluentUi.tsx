import { DetailsList, DetailsListLayoutMode, IColumn, IStackTokens, SelectionMode } from "@fluentui/react";
import { FC, useCallback } from "react";
import { IAktaPendirian } from "../../../features/dokumen/akta-pendirian-api-slice";
import { IDokumenNibOss } from "../../../features/dokumen/dokumen-nib-oss-slice";
import { ILampiranSuratArahan } from "../../../features/dokumen/lampiran-surat-arahan-api-slice";
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

const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const DataListPermohonanFluentUI: FC<ISubFormDetailPermohonanProps> = ({dataPermohonan}) => {
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
                        <span>Jumlah Dokumen : {item.daftarDokumenSyarat?.length}</span><br />                     
                        {
                            item.daftarDokumenSyarat?.map((dataRegisterDokumen:IRegisterDokumen) => {
                                let dokumen = null;
                                if(dataRegisterDokumen.dokumen?.id == '010401') {
                                    dokumen = dataRegisterDokumen.dokumen as ISuratArahan;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010402') {
                                    dokumen = dataRegisterDokumen.dokumen as ILampiranSuratArahan;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor surat arahan: {dokumen?.noSuratArahan}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010101') {
                                    dokumen = dataRegisterDokumen.dokumen as IAktaPendirian;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.nomor}</span><br />
                                            <span>notaris: {dokumen?.namaNotaris}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010404') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiUKLUPL;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010406') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiDPLH;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010301') {
                                    dokumen = dataRegisterDokumen.dokumen as IDokumenNibOss;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.nomor}</span><br />
                                            <span>perihal: {dokumen?.tanggal}</span><br />
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
    return (
        <DetailsList
            columns={_columns}
            items={dataPermohonan}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            onRenderItemColumn={handleRenderItemColumn}
            selectionMode={SelectionMode.none}
        />
    );
};