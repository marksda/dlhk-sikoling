import { FC } from "react"
import { Dropdown, IDropdownProps } from "@fluentui/react"
import { IPropinsi } from "../../features/propinsi/propinsi-slice"
import { HookFluentUiDropDownProps, HookFormProps } from "../../app/HookFormProps"
import { Controller } from "react-hook-form"


interface IPropinsiPropsComponent {
    propinsi: IPropinsi;
    setPropinsi: any;
    isFetching: boolean;
}

export const PropinsiDropDown: FC<HookFluentUiDropDownProps & IPropinsiPropsComponent & IDropdownProps> = (props) => {
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
                    selectedKey={!props.isFetching ? props.propinsi.id : undefined}
                    onChange={(_e, itemSelected) => {
                        let item = {id: itemSelected?.key as string, nama: itemSelected?.text};
                        props.setPropinsi(item);
                        value.propinsi = item;
                        value.kabupaten = null;
                        value.kecamatan = null;
                        value.desa = null;
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