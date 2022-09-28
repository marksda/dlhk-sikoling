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

// export interface HookFluentUIUploadFileProps {

// }

export interface HookFormEmailProps {
    variant?: any;
    setVariant?: any;
    setValue?: any;
    changeHightContainer?: any;
    dispatch?: any;
    setIsLoading?: any;
    setIsErrorConnection?: any;
}

export interface HookFormPasswordProps {
    variant?: any;
    setVariant?: any;
    changeHightContainer?: any;
    userName?: string;
    password?: string;  
    dispatch?: any;
}

export interface HookFormPersonIdentityStepOneProps {
    variant?: any;
    setVariant?: any;
    changeHightContainer?: any;
    userName?: string;
    control?: Control<any>;
}

export interface HookFormPersonIdentityStepTwoProps {
    variant?: any;
    setVariant?: any;
    setValue?: any;
    changeHightContainer?: any;
    userName?: string;
    control?: Control<any>;
}

export interface HookFormUploadKTP {
    variant?: any;
    setVariant?: any;
    setValue?: any;
    changeHightContainer?: any;
    userName?: string;
    handleSubmit?: any;
    authentication?: any;
    setIsLoading?: any;
    setIsErrorConnection?: any;
}

export interface HookMessageBarProps {
    message?: string;
    resetChoice?: () => void;
}