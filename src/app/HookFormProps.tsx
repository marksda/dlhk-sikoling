import { Control, UseControllerProps } from "react-hook-form";
import { IJenisKelamin } from "../features/jenis-kelamin/jenis-kelamin-slice";

export interface HookFormProps {
    control: Control<any>;
    name: string;
    rules?: UseControllerProps["rules"];
    defaultValue?: any;
}