import { FC } from "react";
import { useForm } from "react-hook-form";
import { defaultDesa, defaultKabupaten, defaultKecamatan, defaultPropinsi } from "../../features/config/config";
import { IPemrakarsa } from "../../features/pemrakarsa/pemrakarsa-slice";

export const FormulirPemrakarsa: FC = () => {

    const { control, handleSubmit, setValue } = useForm<IPemrakarsa>({
        mode: 'onSubmit',
        defaultValues: {
            id: null,
            bentukUsaha: {

            },
            aktaPemrakarsa: {

            },
            alamat: {
                propinsi: defaultPropinsi,
                kabupaten: defaultKabupaten,
                kecamatan: defaultKecamatan,
                desa: defaultDesa,
                keterangan: '',
            },
            kontakPemrakarsa: {

            },
            oss: {

            },
            nama: null,
            npwp: null,
            penanggungJawab: {

            },
            idCreator: '00001'
        }
    });

    return(
        <></>
    );
};