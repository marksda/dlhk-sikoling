import { DatePicker, DayOfWeek, defaultDatePickerStrings, IStackTokens, ITextFieldStyles, Label, Stack } from "@fluentui/react";
import { FC, useState } from "react";
import { Control } from "react-hook-form";
import { DayPickerIndonesiaStrings, onFormatDate } from "../../features/config/config";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";



interface IAktaPropsComponent {
    title: string;
    control?: Control<any>;
    setValue?: any;
    name?: string;
};

const stackTokens: IStackTokens = { childrenGap: 8 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };


export const AktaGroup: FC<IAktaPropsComponent> = (props) => {

    // const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);

    return (
        <>
        <Label style={{borderBottom: '2px solid grey', marginBottom: 8}}>
            {props.title}
        </Label> 
        <div style={{marginLeft: 8}}>
            <Stack tokens={stackTokens}>
                <ControlledFluentUiTextField
                    required
                    label="Nomor Akta"
                    control={props.control}
                    name={`${props.name}.nomor`}
                    rules={{ required: "harus diisi sesuai dengan akta" }}                    
                    styles={textFieldStyles}    
                />
                <DatePicker
                    isRequired
                    label="Tanggal Akta"
                    firstDayOfWeek={DayOfWeek.Sunday}
                    placeholder="Pilih tanggal.."
                    ariaLabel="Piih tanggal"
                    strings={DayPickerIndonesiaStrings}
                    formatDate={onFormatDate}
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