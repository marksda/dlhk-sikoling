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
                        field: { onChange, onBlur, name: fieldName, value },
                        fieldState: { error }
                    }
                ) => (
                <Dropdown
                    {...props}
                    // selectedKey={value.id != '' ? item.id : undefined}
                    onChange={
                        (_e, item) => {                            
                            let itemModelPerizinanSelected = props.options.find(
                                (itemSelected) => { return itemSelected.id == item!.key; } 
                            )
                            console.log(value);
                            // onChange(itemModelPerizinanSelected);
                            
                            // let itemSelected = {id: item?.key as string, nama: item?.text};
                            // setItem(itemSelected);
                            // onChange(itemSelected);
                            // if(typeof props.onChangeItem != 'undefined') {
                            //     props.onChangeItem(itemSelected);
                            // }                            
                        }
                    }
                    onBlur={onBlur}
                    errorMessage={error && error?.message}
                />
            )}
        /> 
    );
}