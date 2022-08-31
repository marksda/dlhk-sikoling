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
    background: 'RGB(204, 203, 202)'
    // backgroundImage: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)'
}

export const UserRegistrasi: FC = () => {
    return (
        <div style={containerStyle}>
            <FormulirPerson />
        </div>
    );
}