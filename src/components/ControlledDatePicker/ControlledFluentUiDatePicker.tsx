import { DatePicker, IDatePickerProps } from "@fluentui/react";
import { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { HookFormProps } from "../../app/HookFormProps";
import { onFormatDate } from "../../features/config/config";


export const ControlledFluentUiDatePicker: FC<HookFormProps & IDatePickerProps> = (props) => {
    return (
        typeof props.control != 'undefined' ?
        <Controller 
            name={props.name}
            control={props.control}
            rules={props.rules}
            render={({
                field: { onChange, onBlur, name: fieldName, value },
                fieldState: { error }
            }) => (
                <DatePicker 
                    {...props}
                    onSelectDate={
                        (date) => {
                            onChange(onFormatDate(date!));
                        }
                    }          
                />
            )}  
        /> :
        <DatePicker {...props}/>
    );
}