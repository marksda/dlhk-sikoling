import { Breadcrumb,  IBreadcrumbItem,  Stack } from "@fluentui/react";
import { useMemo, useState } from "react";
import { DashboardDefault } from "./dashboard/default";
import { KontenDashboardPerusahaan } from "./dashboard/dashboard-perusahaan";
import find from "lodash.find";
import cloneDeep from "lodash.clonedeep";

const _daftarBreadCrumb = [
    {key: 'default', value: [{text: 'Dashboard', key: 'dashboard-default'}]},
    {key: 'Perusahaan', value: [
        {text: 'Dashboard', key: 'default'},
        {text: 'Perusahaan', key: 'Perusahaan'}
    ]},
    
];

export const KontenDashboardPemrakarsa = () => {
    //local state    
    const [selectedPage, setSelectedPage] = useState<string>('default');
    // const [selectedBreadCrumb, setSelectedBreadCrumb] = useState<Array<any>>([]);

    const selectedBreadCrumb: IBreadcrumbItem[] = useMemo(
        () => {
            let breadCrumbObject;
            let arrayBreadCrumb: IBreadcrumbItem[];
            switch (selectedPage) {
                case 'default':
                    breadCrumbObject = find(_daftarBreadCrumb, (item) => (item.key == selectedPage));
                    arrayBreadCrumb = cloneDeep(breadCrumbObject?.value) as IBreadcrumbItem[];
                    break;
                case 'Perusahaan':
                    breadCrumbObject = find(_daftarBreadCrumb, (item) => (item.key == selectedPage));
                    arrayBreadCrumb = cloneDeep(breadCrumbObject?.value) as Array<IBreadcrumbItem> ; 
                    arrayBreadCrumb[0].onClick = (e, i) => setSelectedPage(i?.key!);
                    break;
                default:
                    arrayBreadCrumb = []
                    break;
            }

            return arrayBreadCrumb;
        },
        [selectedPage]
    );

    const konten = useMemo(
        () => {
            let kontenTerpilih;
            switch (selectedPage) {
                case 'default':
                    kontenTerpilih = <DashboardDefault setParentPage={setSelectedPage}/>;
                    break;
                case 'Perusahaan':
                    kontenTerpilih = <KontenDashboardPerusahaan/>;
                    break;
                default:
                    kontenTerpilih = null;
                    break;
            }

            return kontenTerpilih;
        },
        [selectedPage]
    );

    return (
        <div style={{margin: '0px 16px'}}>
            <Stack>
                <Stack.Item>                
                    <Breadcrumb
                        items={selectedBreadCrumb}
                        maxDisplayedItems={3}
                        ariaLabel="Breadcrumb beranda"
                        overflowAriaLabel="More links"
                    />
                </Stack.Item>
                <Stack.Item grow align="auto"> 
                    {konten}
                </Stack.Item>
            </Stack>
        </div>
    );
};

// const getKontentDashboard = (item: string, setParentPage: React.Dispatch<React.SetStateAction<string>>) => {
//     let konten = null;
//     switch (item) {
//         case 'default':
//             konten = 
//                 <Stack>
//                     <Stack.Item>                
//                         <Breadcrumb
//                             items={[{text: 'Dashboard', key: 'dashboard-default'}]}
//                             maxDisplayedItems={3}
//                             ariaLabel="Breadcrumb beranda"
//                             overflowAriaLabel="More links"
//                         />
//                     </Stack.Item>
//                     <Stack.Item grow align="auto"> 
//                         <DashboardDefault setParentPage={setParentPage}/>
//                     </Stack.Item>
//                 </Stack>;
//             break; 
//         case 'Perusahaan':
//             konten = 
//                 <Stack>
//                     <Stack.Item>                
//                         <Breadcrumb
//                             items={[
//                                 {text: 'Dashboard', key: 'default', onClick: () => setParentPage('default')},
//                                 {text: 'Perusahaan', key: 'Perusahaan', href:''}
//                             ]}
//                             maxDisplayedItems={3}
//                             ariaLabel="Breadcrumb beranda"
//                             overflowAriaLabel="More links"
//                         />
//                     </Stack.Item>
//                     <Stack.Item grow align="auto"> 
//                         <KontenDashboardPerusahaan/>
//                     </Stack.Item>
//                 </Stack>;
//             break;
//         case 'plp':
//             // konten = <KontenPelaporanPemrakarsa />;   
//             break;
//         default:
//             break;
//     }
//     return konten;
// };