import { FC } from "react"
import { Dropdown, IDropdownProps } from "@fluentui/react"
import { HookFormProps } from "../../app/HookFormProps"
import { Controller } from "react-hook-form"
import { IKabupaten } from "../../features/kabupaten/kabupaten-slice"


interface IKabupatenPropsComponent {
    kabupaten: IKabupaten;
    setKabupaten: any;
    isFetching: boolean;
}

export const KabupatenDropDown: FC<HookFormProps & IKabupatenPropsComponent & IDropdownProps> = (props) => {
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
                    selectedKey={props.kabupaten.id}
                    onChange={(_e, itemSelected) => {
                        let item = {id: itemSelected?.key as string, nama: itemSelected?.text};
                        props.setKabupaten(item);
                        value.kabupaten = item;
                        onChange(value);
                    }}
                    onBlur={onBlur}
                    errorMessage={error && error?.message}
                    disabled={props.isFetching}
                />
            )}
        />
    );
}