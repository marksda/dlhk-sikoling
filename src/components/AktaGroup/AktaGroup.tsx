import { DatePicker, DayOfWeek, defaultDatePickerStrings, IStackTokens, ITextFieldStyles, Label, Stack } from "@fluentui/react";
import { FC, useState } from "react";
import { Control } from "react-hook-form";
import { DayPickerIndonesiaStrings, onFormatDate } from "../../features/config/config";
import { ControlledFluentUiDatePicker } from "../ControlledDatePicker/ControlledFluentUiDatePicker";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { IContainerUploadStyle, UploadFilesFluentUi } from "../UploadFiles/UploadFilesFluentUI";



interface IAktaPropsComponent {
    title: string;
    control?: Control<any>;
    setValue?: any;
    name?: string;
};

const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
const containerStyle: IContainerUploadStyle = {
    width: 300, 
    height: 100, 
    backgroundColor: '#ECECEC',
};

export const AktaGroup: FC<IAktaPropsComponent> = (props) => {

    // const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);

    return (
        <>
        <Label style={{borderBottom: '2px solid grey', marginBottom: 8}}>
            {props.title}
        </Label> 
        <div style={{marginLeft: 0}}>
            <Stack tokens={stackTokens}>
                <UploadFilesFluentUi 
                    label={`Upload File ${props.title}`}
                    showPreview={true}
                    showListFile={false}
                    containerStyle={containerStyle}
                />
                <ControlledFluentUiTextField
                    required
                    label="Nomor"
                    control={props.control}
                    name={`${props.name}.nomor`}
                    rules={{ required: "harus diisi sesuai dengan akta" }}                    
                    styles={textFieldStyles}    
                />
                <ControlledFluentUiDatePicker
                    name={`${props.name}.tanggal`}
                    isRequired
                    label="Tanggal"
                    firstDayOfWeek={DayOfWeek.Sunday}
                    placeholder="Pilih tanggal.."
                    ariaLabel="Piih tanggal"
                    strings={DayPickerIndonesiaStrings}
                    formatDate={onFormatDate}
                    control={props.control}
                />
                <ControlledFluentUiTextField
                    required
                    label="Nama Notaris"
                    control={props.control}
                    name={`${props.name}.namaNotaris`}
                    rules={{ required: "harus diisi sesuai akta" }}                    
                    styles={textFieldStyles}    
                />
            </Stack>
        </div>
        </>
    );
}