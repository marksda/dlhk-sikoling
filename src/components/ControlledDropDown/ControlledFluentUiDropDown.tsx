import { Dropdown, IDropdownProps } from "@fluentui/react";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { HookFluentUiDropDownProps } from "../../app/HookFormProps";

export const ControlledFluentUiDropDown: FC<HookFluentUiDropDownProps & IDropdownProps> = (props) => {    
    return (        
        <Controller 
            name={props.name}
            control={props.control}
            rules={props.rules}
            render={
                ({field: { onBlur}, fieldState: { error }}) => (
                    <Dropdown
                        {...props}
                        onChange={
                            (_e, item) => {      
                                props.onChangeItem(item);                       
                            }
                        }
                        onBlur={onBlur}
                        errorMessage={error && error?.message}
                    />
                )}
        /> 
    );
}