import { DefaultEffects, Stack } from "@fluentui/react";
import { FC } from "react";
import { FormulirPerson } from "../components/FormulirPerson/FormulirPerson";
import { FormulirRegistrasi } from "../components/FormulirRegistrasi/FormulirRegistrasi";
import { UploadFilesFluentUi } from "../components/UploadFiles/UploadFilesFluentUI";



const containerStyle: React.CSSProperties = {
    display: 'table-cell',
    verticalAlign: 'middle',
    width: '100vw',
    height: '100vh',
    // background: 'radial-gradient(circle, rgba(131,58,180,1) 0%, rgba(29,253,194,0.6755077030812324) 48%, rgba(252,176,69,1) 100%)'
}

export const UserRegistrasi: FC = () => {
    return (
        <div style={containerStyle}>
            <FormulirRegistrasi />
        </div>
    );
}