import { useBoolean } from "@fluentui/react-hooks";
import omit from "lodash.omit";
import { FC, useCallback, useMemo } from "react";
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

type daftarItemRegisterPerusahaan = IListItemRegisterPerusahaan[];

export const KontenDashboardPerusahaan: FC = () => {
    //redux global state
    const token = useAppSelector(state => state.token);
    //local state
    const [isModalAddPerusahaanOpen, { setTrue: showModalAddPerusahaan, setFalse: hideModalAddModalPerusahaan }] = useBoolean(false);    
    //rtk query perusahaan variable hook
    const { data: daftarRegisterPerusahaan, error: errorFetchDataPerusahaan,  isFetching: isFetchingDaftarRegisterPerusahaan, isError } = useGetRegisterPerusahaanByIdLinkKepemilikanQuery(token.userId as string);
    const [deleteLinkPersonPerusahaan, { isLoading: isDeleting }] = useDeleteLinkKepemilikanRegisterPerusahaanMutation();

    const dataPerusahaan: daftarItemRegisterPerusahaan = useMemo(
        () => {
            if(daftarRegisterPerusahaan != undefined) {
                return [
                    ...daftarRegisterPerusahaan.map(
                        (t) => (
                            {key: t.id as string, ...omit(t, ['id'])}
                        )
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarRegisterPerusahaan]
    );

    const handleDeletePerusahaan = useCallback(
        (idRegisterPerusahaan) => {
            deleteLinkPersonPerusahaan(idRegisterPerusahaan);
        },
        [token]
    );
    
    return(
        <>            
        <DataListPerusahaanFluentUI 
            showModalAddPerusahaan={showModalAddPerusahaan} 
            hideModalAddModalPerusahaan={hideModalAddModalPerusahaan}
            isDataLoading={isFetchingDaftarRegisterPerusahaan}
            dataPerusahaan={dataPerusahaan}
            deletePerusahaan={handleDeletePerusahaan}
        />            
        <ModalFormulirAddPerusahaan 
            isModalOpen={isModalAddPerusahaanOpen}
            hideModal={hideModalAddModalPerusahaan}
            isDraggable={true}
        />                 
        </>
        
    );
    
}