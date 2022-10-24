import { Dropdown, IDropdownProps } from "@fluentui/react";
import { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { HookFluentUiDropDownProps } from "../../app/HookFormProps";


export const ControlledFluentUiDropDown: FC<HookFluentUiDropDownProps & IDropdownProps> = (props) => {
    // const [item, setItem] = useState(props.defaultItemSelected);
    // console.log(props.defaultItemSelected);
    
    return (        
        <Controller 
            name={props.name}
            control={props.control}
            rules={props.rules}
            render={
                (
                    {
                        field: { onBlur},
                        fieldState: { error }
                    }
                ) => (
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