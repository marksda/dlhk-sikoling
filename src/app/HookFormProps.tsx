import { Control, UseControllerProps } from "react-hook-form";

export interface HookFormProps {
    control?: Control<any>;
    name: string;
    rules?: UseControllerProps["rules"];
    defaultValue?: any;
}

export interface HookFluentUiDropDownProps extends HookFormProps {
    defaultItemSelected?: any;
    onChangeItem?: any;
    isFetching?: boolean;
}

export interface HookFormEmailProps {
    variant?: any;
    setVariant?: any;
    setValue?: any;
    changeHightContainer?: any;
    userName?: string;
    dispatch?: any;
}

export interface HookFormPasswordProps {
    variant?: any;
    setVariant?: any;
    setValue?: any;
    changeHightContainer?: any;
    userName?: string;
    password?: string;  
    dispatch?: any;
}