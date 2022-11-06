import { FC } from "react"
import { IMaskedTextFieldProps, MaskedTextField } from "@fluentui/react"
import { Controller } from "react-hook-form"
import { HookFormProps } from "../../app/HookFormProps"


export const ControlledFluentUiMaskTextField: FC<HookFormProps & IMaskedTextFieldProps> = (props) => {
    return (
        <Controller 
            name={props.name}
            control={props.control}
            rules={props.rules}
            render={({
                field: { onChange, onBlur, name: fieldName, value },
                fieldState: { error }
            }) => (
                <MaskedTextField 
                    {...props}
                    onChange={
                        (event, v) => {
                            onChange(v);
                        }
                    }
                    onBlur={onBlur}
                    name={fieldName}
                    errorMessage={error && error.message} 
                    value={value}            
                />
            )}  
        /> 
    );
}