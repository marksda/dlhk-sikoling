import { CommandBar, DefaultEffects, ICommandBarItemProps, IStackTokens, Stack } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { FC } from "react";
import { DataListPerusahaanFluentUI } from "../../../components/DataList/DataListPerusahaanFluentUI";
import { ModalFormulirAddPerusahaan } from "../../../components/Modal/ModalFormulirAddPerusahaan";

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
    const [isModalAddPerusahaanOpen, { setTrue: showModalAddPerusahaan, setFalse: hideModalAddModalPerusahaan }] = useBoolean(false);
    
    return(
        <>            
            <DataListPerusahaanFluentUI 
                showModalAddPerusahaan={showModalAddPerusahaan} 
                hideModalAddModalPerusahaan={hideModalAddModalPerusahaan}/>
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