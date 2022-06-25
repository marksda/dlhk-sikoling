import { Dropdown, IDropdownProps } from "@fluentui/react";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { HookFormProps } from "../../app/HookFormProps";
import { IJenisKelamin } from "../../features/jenis-kelamin/jenis-kelamin-slice";


export const ControlledDropDown: FC<HookFormProps & IDropdownProps> = (props) => {
    return (
        <Controller 
            name={props.name}
            control={props.control}
            rules={props.rules}
            defaultValue={props.defaultValue}
            render={({
                field: { onChange, onBlur, name: fieldName, value },
                fieldState: { error }
            }) => (
                <Dropdown
                    {...props}
                    selectedKey={value.id}
                    onChange={(_e, option) => {
                        onChange({id: option?.key as string, nama: option?.text});
                    }}
                    onBlur={onBlur}
                    errorMessage={error && error?.message}
                    defaultValue={props.defaultValue}
                />
            )}
        />
    );
}