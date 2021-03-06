import { DayOfWeek, IStackTokens, ITextFieldStyles, Label, Stack } from "@fluentui/react";
import { FC } from "react";
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
                    showPreview={false}
                    showListFile={false}
                    containerStyle={containerStyle}   
                    teachingBubbleVisible={true}
                    teachingBubbleText={`Tekan tombol disamping untuk upload file ${props.title}, file harus berjenis pdf dan hanya berisi ${props.title} saja, alias tidak boleh dicampur dengan dokumen lain dalam satu file pdf`}            
                />
                <ControlledFluentUiTextField
                    required
                    label="Nomor"
                    control={props.control}
                    name={`${props.name}.nomor`}
                    rules={{ required: "harus diisi sesuai dengan akta" }}                    
                    styles={textFieldStyles}     
                    placeholder={`isikan sesuai dalam ${props.title}`}                   
                />
                <ControlledFluentUiDatePicker
                    name={`${props.name}.tanggal`}
                    isRequired
                    label="Tanggal"
                    firstDayOfWeek={DayOfWeek.Sunday}
                    placeholder={`Pilih tanggal sesuai dalam ${props.title}`}
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
                    placeholder={`isikan sesuai dalam ${props.title}`}
                />
            </Stack>
        </div>
        </>
    );
}