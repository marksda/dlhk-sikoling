import { useBoolean } from "@fluentui/react-hooks";
import omit from "lodash.omit";
import { FC, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { DataListPerusahaanFluentUI } from "../../../components/DataList/perusahaan/DataListPerusahaanFluentUI";
import { IListItemRegisterPerusahaan } from "../../../components/DataList/perusahaan/InterfaceDataListPerusahaan";
import { ModalFormulirAddPerusahaan } from "../../../components/Modal/ModalFormulirAddPerusahaan";
import { useDeleteLinkKepemilikanRegisterPerusahaanMutation, useGetRegisterPerusahaanByIdLinkKepemilikanQuery } from "../../../features/perusahaan/register-perusahaan-api-slice";

// const containerDivStyles: React.CSSProperties = {    
//     boxShadow: DefaultEffects.elevation4, 
//     // borderTop: '2px solid orange', 
//     borderTop: '2px solid #0078D7', 
//     borderRadius: 3, 
//     padding: 16,
//     background: 'white',
//     height: 'calc(100vh - 148px)',
//     marginLeft: 4,
// };

export const KontenDashboardPerusahaan: FC = () => {
    //redux global state
    const token = useAppSelector(state => state.token);

    //local state
    const [isModalAddPerusahaanOpen, { setTrue: showModalAddPerusahaan, setFalse: hideModalAddModalPerusahaan }] = useBoolean(false);
    const [dataPerusahaan, setDataPerusahaan] = useState<IListItemRegisterPerusahaan[]>([]);
    
    //rtk query perusahaan variable hook
    const { data: daftarRegisterPerusahaan = [], error: errorFetchDataPerusahaan,  isFetching: isFetchingDaftarRegisterPerusahaan, isError } = useGetRegisterPerusahaanByIdLinkKepemilikanQuery(token.userId as string);
    const [deleteLinkPersonPerusahaan, { isLoading: isDeleting }] = useDeleteLinkKepemilikanRegisterPerusahaanMutation();

    useEffect(
        () => {
            if(isFetchingDaftarRegisterPerusahaan == false && daftarRegisterPerusahaan.length > 0){
                setDataPerusahaan([
                    ...daftarRegisterPerusahaan.map(
                        (t) => (
                            {key: t.perusahaan?.id as string, ...omit(t, ['id'])}
                        )
                    )
                ]);
            }
        },
        [daftarRegisterPerusahaan, isFetchingDaftarRegisterPerusahaan]
    );

    const handleDeletePerusahaan = useCallback(
        (idPerusahaan) => {
            deleteLinkPersonPerusahaan({
                idPerusahaan: idPerusahaan, 
                idPerson: token.userId as string
            });
        },
        [token]
    );
    
    return(
        <>            
            <DataListPerusahaanFluentUI 
                showModalAddPerusahaan={showModalAddPerusahaan} 
                hideModalAddModalPerusahaan={hideModalAddModalPerusahaan}
                dataPerusahaan={dataPerusahaan}
                deletePerusahaan={handleDeletePerusahaan}
            />
            {
            isModalAddPerusahaanOpen &&
            <ModalFormulirAddPerusahaan 
                isModalOpen={isModalAddPerusahaanOpen}
                hideModal={hideModalAddModalPerusahaan}
                isDraggable={true}
            />  
            }                   
        </>
        
    );
    
}