import { Dropdown, IDropdownProps } from "@fluentui/react";
import { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { HookFluentUiDropDownProps } from "../../app/HookFormProps";


export const ControlledFluentUiDropDown: FC<HookFluentUiDropDownProps & IDropdownProps> = (props) => {
    const [item, setItem] = useState(props.defaultItemSelected);
    
    return (        
        typeof props.control != 'undefined' ?
        <Controller 
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.defaultItemSelected}
            render={({
                field: { onChange, onBlur, name: fieldName, value },
                fieldState: { error }
            }) => (
                <Dropdown
                    {...props}
                    selectedKey={typeof item != 'undefined' ? item.id : undefined}
                    onChange={
                        (_e, item) => {
                            let itemSelected = {id: item?.key as string, nama: item?.text};
                            setItem(itemSelected);
                            onChange(itemSelected);
                            if(typeof props.onChangeItem != 'undefined') {
                                props.onChangeItem(itemSelected);
                            }                            
                        }
                    }
                    onBlur={onBlur}
                    errorMessage={error && error?.message}
                />
            )}
        /> :
        <Dropdown
            {...props}
            selectedKey={typeof item != 'undefined' ? item.id : undefined}
            onChange={
                (_e, item) => {
                    let itemSelected = {id: item?.key as string, nama: item?.text};
                    setItem(itemSelected);
                    if(typeof props.onChangeItem != 'undefined') {
                        props.onChangeItem(itemSelected);
                    }                            
                }
            }
            disabled={props.isFetching}
        />
    );
}