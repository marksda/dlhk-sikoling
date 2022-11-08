import { CommandBar, DefaultEffects, ICommandBarItemProps, IStackTokens, Stack } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { FC } from "react";
import { DataListPerusahaanFluentUI } from "../../../components/DataList/DataListPerusahaanFluentUI";
import { ModalFormulirAddPerusahaan } from "../../../components/Modal/ModalFormulirAddPerusahaan";

const containerDivStyles: React.CSSProperties = {    
    boxShadow: DefaultEffects.elevation4, 
    // borderTop: '2px solid orange', 
    borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    padding: 16,
    background: 'white',
    height: 'calc(100vh - 148px)',
    marginLeft: 4,
};
const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const KontenDashboardPerusahaan: FC = () => {
    const [isModalAddPerusahaanOpen, { setTrue: showModalAddPerusahaan, setFalse: hideModalAddModalPerusahaan }] = useBoolean(false);
    const _items: ICommandBarItemProps[] = [
        {
            key: 'add',
            text: 'Tambah',
            iconProps: { iconName: 'Add' },
            onClick: showModalAddPerusahaan,
        },
        {
            key: 'edit',
            text: 'Ubah',
            iconProps: { iconName: 'Edit' },
            onClick: () => console.log('Share'),
        },
        {
            key: 'delete',
            text: 'Hapus',
            iconProps: { iconName: 'Delete' },
            onClick: () => console.log('Share'),
        }
    ];
    
    return(
        <>
            <Stack horizontal tokens={containerLoginStackTokens} style={{borderBottom : '1px solid rgb(237, 235, 233)'}}>
                <Stack.Item>
                    <CommandBar
                        items={_items}   
                    />
                </Stack.Item>
            </Stack>
            <Stack>
                <DataListPerusahaanFluentUI />
            </Stack>   
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