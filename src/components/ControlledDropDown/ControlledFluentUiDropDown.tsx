import { Dropdown, IDropdownProps } from "@fluentui/react";
import { FC, useState } from "react";
import { Controller } from "react-hook-form";
import { HookFluentUiDropDownProps } from "../../app/HookFormProps";


export const ControlledFluentUiDropDown: FC<HookFluentUiDropDownProps & IDropdownProps> = (props) => {
    const [item, setItem] = useState(props.defaultItemSelected);

    return (        
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
                    selectedKey={!props.isFetching ? item.id : undefined}
                    onChange={
                        (_e, item) => {
                            let itemSelected = {id: item?.key as string, nama: item?.text};
                            setItem(itemSelected);
                            onChange(itemSelected);
                            props.onChangeItem != undefined ? props.onChangeItem(itemSelected) : null;                              
                        }
                    }
                    onBlur={onBlur}
                    errorMessage={error && error?.message}
                    disabled={props.isFetching}
                />
            )}
        />
    );
}