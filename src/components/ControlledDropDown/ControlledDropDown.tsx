import { Dropdown, IDropdownProps } from "@fluentui/react";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { HookFormProps } from "../../app/HookFormProps";


export const ControlledDropDown: FC<HookFormProps & IDropdownProps> = (props) => {
    return (
        <Controller 
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.nilaiDefault}
            render={({
                field: { onChange, onBlur, name: fieldName, value },
                fieldState: { error }
            }) => (
                <Dropdown
                    {...props}
                    selectedKey={value.id}
                    onChange={(_e, itemSelected) => {
                        onChange({id: itemSelected?.key as string, nama: itemSelected?.text});
                    }}
                    onBlur={onBlur}
                    errorMessage={error && error?.message}
                />
            )}
        />
    );
}