import { Control, UseControllerProps } from "react-hook-form";

export interface HookFormProps {
    control: Control<any>;
    name: string;
    rules?: UseControllerProps["rules"];
    defaultValue?: any;
}