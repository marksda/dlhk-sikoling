import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IPerson } from "../../entity/person";
import { IPropinsi } from "../../entity/propinsi";
import { IKabupaten } from "../../entity/kabupaten";
import { IKecamatan } from "../../entity/kecamatan";
import { IDesa } from "../../entity/desa";
import { IJenisKelamin } from "../../entity/jenis-kelamin";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";
import { IHakAkses } from "../../entity/hak-akses";
import { IPegawai } from "../../entity/pegawai";
import { IRegisterPerusahaan } from "../../entity/register-perusahaan";
import { IJabatan } from "../../entity/jabatan";
import { IModelPerizinan } from "../../entity/model-perizinan";
import { ISkalaUsaha } from "../../entity/skala-usaha";
import { IKategoriPelakuUsaha } from "../../entity/kategori-pelaku-usaha";
import { IPelakuUsaha } from "../../entity/pelaku-usaha";
import { IDokumen } from "../../entity/dokumen";
import { IKategoriDokumen } from "../../entity/kategori-dokumen";
import { IRegisterDokumen } from "../../entity/register-dokumen";
import { IKbli } from "../../entity/kbli";
import { IRegisterKbli } from "../../entity/register-kbli";
import { IOtoritas } from "../../entity/otoritas";
import { IStatusFlowLog } from "../../entity/status-flow-log";
import { IKategoriFlowLog } from "../../entity/kategori-flow-log";
import { IOtoritasPerusahaan } from "../../entity/otoritas-perusahaan";
import { IKategoriPermohonan } from "../../entity/kategori-permohonan";

export const sikolingApi = createApi({
    reducerPath: 'sikolingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ConfigEditor', 'Desa', 'Dokumen', 'Jabatan', 'Image', 'HakAkses', 'Kabupaten', 'KategoriDokumen', 'KategoriFlowLog', 'KategoriPelakuUsaha', 'KategoriPermohonan', 'Kbli', 'Kecamatan', 'Kosong', 'ModelPerizinan', 'Otoritas', 'OtoritasPerusahaan', 'Pegawai', 'PelakuUsaha', 'Person', 'Propinsi', 'RegisterDokumen', 'RegisterKbli', 'RegisterPerusahaan', 'Sex', 'SkalaUsaha', 'StatusFlowLog' ],
    endpoints: builder => {
        return {
            getDataImage: builder.query<any, string>({
                query: (path) => ({
                    url:`/file/download?fileNameParam=${path}`,
                    method: 'GET',
                    responseHandler: (response) => {
                        if(response.status == 500) {
                            return response.json();
                        }
                        else {
                            return response.blob();
                        }
                    }
                }),
                providesTags: ['Image'],
                transformResponse: (response:Blob): any|null => {
                    return URL.createObjectURL(response);
                },     
                transformErrorResponse: (response, meta, arg) => {
                    // console.log(response);
                }           
            }),
            saveJenisKelamin: builder.mutation<IJenisKelamin, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: '/sex',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            updateJenisKelamin: builder.mutation<IJenisKelamin, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: '/sex',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            updateIdJenisKelamin: builder.mutation<IJenisKelamin, {idLama: String; sex: IJenisKelamin}>({
                query: ({idLama, sex}) => ({
                    url: `/sex/id/${idLama}`,
                    method: 'PUT',
                    body: sex,
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            deleteJenisKelamin: builder.mutation<Partial<IJenisKelamin>, Partial<IJenisKelamin>>({
                query: (sex) => ({                  
                    url: `/sex/${sex.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            getDaftarDataJenisKelamin: builder.query<IJenisKelamin[], IQueryParamFilters>({
                query: (queryParams) => `sex?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Sex']
            }),
            getJumlahDataJenisKelamin: builder.query<number, qFilters>({
                query: (queryFilters) => `sex/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            savePropinsi: builder.mutation<IPropinsi, Partial<IPropinsi>>({
                query: (body) => ({
                    url: '/propinsi',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            updatePropinsi: builder.mutation<void, Partial<IPropinsi>>({
                query: (body) => ({
                    url: '/propinsi',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            updateIdPropinsi: builder.mutation<IPropinsi, {idLama: string; propinsi: IPropinsi}>({
                query: ({idLama, propinsi}) => ({
                    url: `/propinsi/id/${idLama}`,
                    method: 'PUT',
                    body: propinsi,
                }),
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            deletePropinsi: builder.mutation<Partial<IPropinsi>, Partial<IPropinsi>>({
                query: (propinsi) => ({                  
                    url: `/propinsi/${propinsi.id}`,
                    method: 'DELETE',    
                }),
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            getDaftarDataPropinsi: builder.query<IPropinsi[], IQueryParamFilters>({
                query: (queryParams) => `propinsi?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Propinsi']
            }),
            getJumlahDataPropinsi: builder.query<number, qFilters>({
                query: (queryFilters) => `propinsi/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKabupaten: builder.mutation<IKabupaten, Partial<IKabupaten>>({
                query: (body) => ({
                    url: '/kabupaten',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result? ['Kabupaten']:['Kosong']
            }),
            updateKabupaten: builder.mutation<IKabupaten, Partial<IKabupaten>>({
                query: (body) => ({
                    url: '/kabupaten',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Kabupaten']:['Kosong']
            }),
            updateIdKabupaten: builder.mutation<IKabupaten, {idLama: string; kabupaten: IKabupaten}>({
                query: ({idLama, kabupaten}) => ({
                    url: `/kabupaten/id/${idLama}`,
                    method: 'PUT',
                    body: kabupaten,
                }),
                invalidatesTags: (result) => result? ['Kabupaten']:['Kosong']
            }),
            deleteKabupaten: builder.mutation<Partial<IKabupaten>, Partial<IKabupaten>>({
                query: (Kabupaten) => ({                  
                    url: `/kabupaten/${Kabupaten.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Kabupaten']:['Kosong']
            }),
            getDaftarDataKabupaten: builder.query<IKabupaten[], IQueryParamFilters>({
                query: (queryParams) => `kabupaten?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Kabupaten'],
            }),
            getJumlahDataKabupaten: builder.query<number, qFilters>({
                query: (queryFilters) => `kabupaten/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKecamatan: builder.mutation<IKecamatan, Partial<IKecamatan>>({
                query: (body) => ({
                    url: '/kecamatan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            updateKecamatan: builder.mutation<IKecamatan, Partial<IKecamatan>>({
                query: (body) => ({
                    url: '/kecamatan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            updateIdKecamatan: builder.mutation<IKecamatan, {idLama: string; kecamatan: IKecamatan}>({
                query: ({idLama, kecamatan}) => ({
                    url: `/kecamatan/id/${idLama}`,
                    method: 'PUT',
                    body: kecamatan,
                }),
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            deleteKecamatan: builder.mutation<Partial<IKecamatan>, Partial<IKecamatan>>({
                query: (Kecamatan) => ({                  
                    url: `/kecamatan/${Kecamatan.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            getDaftarDataKecamatan: builder.query<IKecamatan[], IQueryParamFilters>({
                query: (queryParams) => `kecamatan?filters=${JSON.stringify(queryParams)}`,
                providesTags:['Kecamatan']
            }),
            getJumlahDataKecamatan: builder.query<number, qFilters>({
                query: (queryFilters) => `kecamatan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveDesa: builder.mutation<IDesa, Partial<IDesa>>({
                query: (body) => ({
                    url: '/desa',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            updateDesa: builder.mutation<IDesa, Partial<IDesa>>({
                query: (body) => ({
                    url: '/desa',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            updateIdDesa: builder.mutation<IDesa, {idLama: string; desa: IDesa}>({
                query: ({idLama, desa}) => ({
                    url: `/desa/id/${idLama}`,
                    method: 'PUT',
                    body: desa,
                }),
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            deleteDesa: builder.mutation<Partial<IDesa>, Partial<IDesa>>({
                query: (desa) => ({                  
                    url: `/desa/${desa.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            getDaftarDataDesa: builder.query<IDesa[], IQueryParamFilters>({
                query: (queryParams) => `/desa?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Desa'],
            }),
            getJumlahDataDesa: builder.query<number, qFilters>({
                query: (queryFilters) => `desa/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            savePerson: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: '/person',
                    method: 'POST',
                    body: dataForm,
                }),
                invalidatesTags: (result) => result ? ['Person']:['Kosong']
            }),
            updatePerson: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: '/person',
                    method: 'PUT',
                    body: dataForm,
                    
                }),
                invalidatesTags: (result) => result? ['Person']:['Kosong']
            }),
            updateIdPerson: builder.mutation<IPerson, {idLama: string; dataForm: FormData}>({
                query: ({idLama, dataForm}) => ({
                    url: `/person/id/${idLama}`,
                    method: 'PUT',
                    body: dataForm,
                }),
                invalidatesTags: (result) => result? ['Person']:['Kosong']
            }),
            deletePerson: builder.mutation<Partial<IPerson>, Partial<IPerson>>({
                query(person) {
                  return {
                    url: `/person?dt=${JSON.stringify(person)}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result? ['Person']:['Kosong']
            }),
            getDaftarDataPerson: builder.query<IPerson[], IQueryParamFilters>({
                query: (queryParams) => `/person?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Person'],
            }),
            getJumlahDataPerson: builder.query<number, qFilters>({
                query: (queryFilters) => `/person/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveHakAkses: builder.mutation<IHakAkses, Partial<IHakAkses>>({
                query: (body) => ({
                    url: '/hak_akses',
                    method: 'POST',
                    body,
                }),
                invalidatesTags:  (result) => result ? ['HakAkses']:['Kosong'],
            }),
            updateHakAkses: builder.mutation<IHakAkses, Partial<IHakAkses>>({
                query: (hakAkses) => ({
                    url: '/hak_akses',
                    method: 'PUT',
                    body: hakAkses,
                }),
                invalidatesTags: (result) => result ? ['HakAkses']:['Kosong'],
            }),
            updateIdHakAkses: builder.mutation<IHakAkses, {idLama: string; hakAkses: IHakAkses}>({
                query: ({idLama, hakAkses}) => ({
                    url: `/hak_akses/id/${idLama}`,
                    method: 'PUT',
                    body: hakAkses,
                }),
                invalidatesTags: (result) => result ? ['HakAkses']:['Kosong'],
            }),
            deleteHakAkses: builder.mutation<Partial<IHakAkses>, Partial<IHakAkses>>({
                query(hakAkses) {
                  return {
                    url: `/hak_akses/${hakAkses.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['HakAkses']:['Kosong'],
            }),
            getDaftarDataHakAkses: builder.query<IHakAkses[], IQueryParamFilters>({
                query: (queryParams) => `/hak_akses?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['HakAkses'],
            }),
            getJumlahDataHakAkses: builder.query<number, qFilters>({
                query: (queryFilters) => `/hak_akses/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            savePegawai: builder.mutation<IPegawai, Partial<IPegawai>>({
                query: (body) => ({
                    url: '/pegawai_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result ? ['Pegawai']:['Kosong'],
            }),
            updatePegawai: builder.mutation<IPegawai, Partial<IPegawai>>({
                query: (body) => ({
                    url: '/pegawai_perusahaan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result ? ['Pegawai']:['Kosong'],
            }),
            updateIdPegawai: builder.mutation<IPegawai, {idLama: string; pegawai: IPegawai}>({
                query: ({idLama, pegawai}) => ({
                    url: `/pegawai_perusahaan/id/${idLama}`,
                    method: 'PUT',
                    body: pegawai,
                }),
                invalidatesTags: (result) => result ? ['Pegawai']:['Kosong'],
            }),
            deletePegawai: builder.mutation<Partial<IPegawai>, Partial<IPegawai>>({
                query(pegawai) {
                  return {
                    url: `/pegawai_perusahaan/${pegawai.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['Pegawai']:['Kosong'],
            }),
            getDaftarDataPegawai: builder.query<IPegawai[], IQueryParamFilters>({
                query: (queryParams) => `/pegawai_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Pegawai'],
            }),
            getJumlahDataPegawai: builder.query<number, qFilters>({
                query: (queryFilters) => `/pegawai_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            addDirektur: builder.mutation<IPegawai, FormData>({
                query: (dataForm) => ({
                    url: '/pegawai_perusahaan/add_direktur',
                    method: 'POST',
                    body: dataForm,
                }),
                invalidatesTags: (result) => result ? ['Pegawai']:['Kosong']
            }),
            saveRegisterPerusahaan: builder.mutation<IRegisterPerusahaan, Partial<IRegisterPerusahaan>>({
                query: (registerPerusahaan) => ({
                    url: '/register_perusahaan',
                    method: 'POST',
                    body: registerPerusahaan,
                }),
                invalidatesTags: (result) => result ? ['RegisterPerusahaan']:['Kosong'],
            }), 
            updateRegisterPerusahaan: builder.mutation<IRegisterPerusahaan, Partial<IRegisterPerusahaan>>({
                query: (registerPerusahaan) => ({
                    url: '/register_perusahaan',
                    method: 'PUT',
                    body: registerPerusahaan,
                }),
                invalidatesTags: (result) => result ? ['RegisterPerusahaan']:['Kosong'],
            }),
            updateIdRegisterPerusahaan: builder.mutation<IRegisterPerusahaan, {idLama: string; registerPerusahaan: IRegisterPerusahaan}>({
                query: ({idLama, registerPerusahaan}) => ({
                    url: `/register_perusahaan/id/${idLama}`,
                    method: 'PUT',
                    body: registerPerusahaan,
                }),
                invalidatesTags: (result) => result ? ['RegisterPerusahaan']:['Kosong'],
            }),
            deleteRegisterPerusahaan: builder.mutation<Partial<IRegisterPerusahaan>, Partial<IRegisterPerusahaan>>({
                query(registerPerusahaan) {
                  return {
                    url: `/register_perusahaan/${registerPerusahaan.id}`,
                    method: 'DELETE'
                  }
                },
                invalidatesTags: (result) => result ? ['RegisterPerusahaan']:['Kosong'],
            }),
            getDaftarDataRegisterPerusahaan: builder.query<IRegisterPerusahaan[], IQueryParamFilters>({
                query: (queryParams) => `/register_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['RegisterPerusahaan'],
            }),
            getJumlahDataRegisterPerusahaan: builder.query<number, qFilters>({
                query: (queryFilters) => `/register_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveJabatan: builder.mutation<IJabatan, Partial<IJabatan>>({
                query: (jabatan) => ({
                    url: '/jabatan_perusahaan',
                    method: 'POST',
                    body: jabatan,
                }),
                invalidatesTags: (result) => result ? ['Jabatan']:['Kosong'],
            }),
            updateJabatan: builder.mutation<IJabatan, Partial<IJabatan>>({
                query: (jabatan) => ({
                    url: '/jabatan_perusahaan',
                    method: 'PUT',
                    body: jabatan,
                }),
                invalidatesTags: (result) => result ? ['Jabatan']:['Kosong'],
            }),
            updateIdJabatan: builder.mutation<IJabatan, {idLama: string; jabatan: IJabatan}>({
                query: ({idLama, jabatan}) => ({
                    url: `/jabatan_perusahaan/id/${idLama}`,
                    method: 'PUT',
                    body: jabatan,
                }),
                invalidatesTags: (result) => result ? ['Jabatan']:['Kosong'],
            }),
            deleteJabatan: builder.mutation<Partial<IJabatan>,Partial<IJabatan>> ({
                query(jabatan) {
                  return {
                    url: `/jabatan_perusahaan/${jabatan.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['Jabatan']:['Kosong'],
            }),
            getDaftarDataJabatan: builder.query<IJabatan[], IQueryParamFilters>({
                query: (queryParams) => `/jabatan_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Jabatan'],
            }),
            getJumlahDataJabatan: builder.query<number, qFilters>({
                query: (queryFilters) => `/jabatan_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveModelPerizinan: builder.mutation<IModelPerizinan, Partial<IModelPerizinan>>({
                query: (modelPerizinan) => ({
                    url: '/model_perizinan',
                    method: 'POST',
                    body: modelPerizinan,
                }),
                invalidatesTags: (result) => result ? ['ModelPerizinan']:['Kosong']
            }),
            updateModelPerizinan: builder.mutation<IModelPerizinan, Partial<IModelPerizinan>>({
                query: (modelPerizinan) => ({
                    url: '/model_perizinan',
                    method: 'PUT',
                    body: modelPerizinan,
                }),
                invalidatesTags: (result) => result ? ['ModelPerizinan']:['Kosong'],
            }),
            updateIdModelPerizinan: builder.mutation<IModelPerizinan, {idLama: string; modelPerizinan: IJabatan}>({
                query: ({idLama, modelPerizinan}) => ({
                    url: `/model_perizinan/id/${idLama}`,
                    method: 'PUT',
                    body: modelPerizinan,
                }),
                invalidatesTags: (result) => result ? ['ModelPerizinan']:['Kosong'],
            }),
            deleteModelPerizinan: builder.mutation<Partial<IModelPerizinan>, Partial<IModelPerizinan>>({
                query(modelPerizinan) {
                  return {
                    url: `/model_perizinan/${modelPerizinan.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['ModelPerizinan']:['Kosong'],
            }),
            getDaftarDataModelPerizinan: builder.query<IModelPerizinan[], IQueryParamFilters>({
                query: (queryParams) => `/model_perizinan?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['ModelPerizinan'],
            }),
            getJumlahDataModelPerizinan: builder.query<number, qFilters>({
                query: (queryFilters) => `model_perizinan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveSkalaUsaha: builder.mutation<ISkalaUsaha, Partial<ISkalaUsaha>>({
                query: (skalaUsaha) => ({
                    url: '/skala_usaha',
                    method: 'POST',
                    body: skalaUsaha,
                }),
                invalidatesTags: (result) => result ? ['SkalaUsaha']:['Kosong'],
            }),
            updateSkalaUsaha: builder.mutation<ISkalaUsaha, Partial<ISkalaUsaha>>({
                query: (skalaUsaha) => ({
                    url: '/skala_usaha',
                    method: 'PUT',
                    body: skalaUsaha,
                }),
                invalidatesTags: (result) => result ? ['SkalaUsaha']:['Kosong'],
            }),
            updateIdSkalaUsaha: builder.mutation<ISkalaUsaha, {idLama: string; skalaUsaha: ISkalaUsaha}>({
                query: ({idLama, skalaUsaha}) => ({
                    url: `/skala_usaha/id/${idLama}`,
                    method: 'PUT',
                    body: skalaUsaha,
                }),
                invalidatesTags: (result) => result ? ['SkalaUsaha']:['Kosong'],
            }),
            deleteSkalaUsaha: builder.mutation<Partial<ISkalaUsaha>, Partial<ISkalaUsaha>>({
                query(skalaUsaha) {
                  return {
                    url: `/skala_usaha/${skalaUsaha.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['SkalaUsaha']:['Kosong'],
            }),
            getDaftarDataSkalaUsaha: builder.query<ISkalaUsaha[], IQueryParamFilters>({
                query: (queryParams) => `/skala_usaha?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['SkalaUsaha'],
            }),
            getJumlahDataSkalaUsaha: builder.query<number, qFilters>({
                query: (queryFilters) => `/skala_usaha/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKategoriPelakuUsaha: builder.mutation<IKategoriPelakuUsaha, Partial<IKategoriPelakuUsaha>>({
                query: (kategoriPelakuUsaha) => ({
                    url: '/kategori_pelaku_usaha',
                    method: 'POST',
                    body: kategoriPelakuUsaha,
                }),
                invalidatesTags: (result) => result ? ['KategoriPelakuUsaha']:['Kosong'],
            }),
            updateKategoriPelakuUsaha: builder.mutation<IKategoriPelakuUsaha, Partial<IKategoriPelakuUsaha>>({
                query: (kategoriPelakuUsaha) => ({
                    url: '/kategori_pelaku_usaha',
                    method: 'PUT',
                    body: kategoriPelakuUsaha,
                }),
                invalidatesTags: (result) => result ? ['KategoriPelakuUsaha']:['Kosong'],
            }),
            updateIdKategoriPelakuUsaha: builder.mutation<IKategoriPelakuUsaha, {idLama: string; kategoriPelakuUsaha: IKategoriPelakuUsaha}>({
                query: ({idLama, kategoriPelakuUsaha}) => ({
                    url: `/kategori_pelaku_usaha/id/${idLama}`,
                    method: 'PUT',
                    body: kategoriPelakuUsaha,
                }),
                invalidatesTags: (result) => result ? ['KategoriPelakuUsaha']:['Kosong'],
            }),
            deleteKategoriPelakuUsaha: builder.mutation<Partial<IKategoriPelakuUsaha>, Partial<IKategoriPelakuUsaha>>({
                query(kategoriPelakuUsaha) {
                  return {
                    url: `kategori_pelaku_usaha/${kategoriPelakuUsaha.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['KategoriPelakuUsaha']:['Kosong'],
            }),
            getDaftarDataKategoriPelakuUsaha: builder.query<IKategoriPelakuUsaha[], IQueryParamFilters>({
                query: (queryParams) => `kategori_pelaku_usaha?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['KategoriPelakuUsaha'],
            }),
            getJumlahDataKategoriPelakuUsaha: builder.query<number, qFilters>({
                query: (queryFilters) => `kategori_pelaku_usaha/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            savePelakuUsaha: builder.mutation<IPelakuUsaha, Partial<IPelakuUsaha>>({
                query: (pelakuUsaha) => ({
                    url: '/pelaku_usaha',
                    method: 'POST',
                    body: pelakuUsaha,
                }),
                invalidatesTags: (result) => result ? ['PelakuUsaha']:['Kosong'],
            }),
            updatePelakuUsaha: builder.mutation<IPelakuUsaha, Partial<IPelakuUsaha>>({
                query: (pelakuUsaha) => ({
                    url: '/pelaku_usaha',
                    method: 'PUT',
                    body: pelakuUsaha,
                }),
                invalidatesTags: (result) => result ? ['PelakuUsaha']:['Kosong'],
            }),
            updateIdPelakuUsaha: builder.mutation<IPelakuUsaha, {idLama: string; pelakuUsaha: IPelakuUsaha}>({
                query: ({idLama, pelakuUsaha}) => ({
                    url: `/pelaku_usaha/id/${idLama}`,
                    method: 'PUT',
                    body: pelakuUsaha,
                }),
                invalidatesTags: (result) => result ? ['PelakuUsaha']:['Kosong'],
            }),
            deletePelakuUsaha: builder.mutation<Partial<IPelakuUsaha>, Partial<IPelakuUsaha>>({
                query(pelakuUsaha) {
                  return {
                    url: `/pelaku_usaha/${pelakuUsaha.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['PelakuUsaha']:['Kosong'],
            }),
            getDaftarDataPelakuUsaha: builder.query<IPelakuUsaha[], IQueryParamFilters>({
                query: (queryParams) => `/pelaku_usaha?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['PelakuUsaha'],
            }),
            getJumlahDataPelakuUsaha: builder.query<number, qFilters>({
                query: (queryFilters) => `/pelaku_usaha/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveDokumen: builder.mutation<IDokumen, Partial<IDokumen>>({
                query: (dokumen) => ({
                    url: '/dokumen',
                    method: 'POST',
                    body: dokumen,
                }),
                invalidatesTags: (result) => result ?['Dokumen']:['Kosong'],
            }),
            updateDokumen: builder.mutation<IDokumen, Partial<IDokumen>>({
                query: (dokumen) => ({
                    url: '/dokumen',
                    method: 'PUT',
                    body: dokumen,
                }),
                invalidatesTags: (result) => result ?['Dokumen']:['Kosong'],
            }),
            updateIdDokumen: builder.mutation<IDokumen, {id: string; dokumen: IDokumen}>({
                query: ({id, dokumen}) => ({
                    url: `/dokumen/id/${id}`,
                    method: 'PUT',
                    body: dokumen,
                }),
                invalidatesTags: (result) => result ?['Dokumen']:['Kosong'],
            }),
            deleteDokumen: builder.mutation<Partial<IDokumen>, Partial<IDokumen>>({
                query(dokumen) {
                  return {
                    url: `/dokumen/${dokumen.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ?['Dokumen']:['Kosong'],
            }),
            getDaftarDataDokumen: builder.query<IDokumen[], IQueryParamFilters>({
                query: (queryParams) => `/dokumen?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Dokumen'],
            }),
            getJumlahDataDokumen: builder.query<number, qFilters>({
                query: (queryFilters) => `/dokumen/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKategoriDokumen: builder.mutation<IKategoriDokumen, Partial<IKategoriDokumen>>({
                query: (kategoriDokumen) => ({
                    url: '/kategori_dokumen',
                    method: 'POST',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result) => result ?['KategoriDokumen']:['Kosong'],
            }),
            updateKategoriDokumen: builder.mutation<IKategoriDokumen, Partial<IKategoriDokumen>>({
                query: (kategoriDokumen) => ({
                    url: '/kategori_dokumen',
                    method: 'PUT',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result) => result ?['KategoriDokumen']:['Kosong'],
            }),
            updateIdKategoriDokumen: builder.mutation<IKategoriDokumen, {id: string; kategoriDokumen: IKategoriDokumen}>({
                query: ({id, kategoriDokumen}) => ({
                    url: `/kategori_dokumen/id/${id}`,
                    method: 'PUT',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result) => result ?['KategoriDokumen']:['Kosong'],
            }),
            deleteKategoriDokumen: builder.mutation<Partial<IKategoriDokumen>, Partial<IKategoriDokumen>>({
                query(kategoriDokumen) {
                  return {
                    url: `/kategori_dokumen/${kategoriDokumen.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['KategoriDokumen']:['Kosong'],
            }),
            getDaftarDataKategoriDokumen: builder.query<IKategoriDokumen[], IQueryParamFilters>({
                query: (queryParams) => `/kategori_dokumen?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['KategoriDokumen'],
            }),
            getJumlahDataKategoriDokumen: builder.query<number, qFilters>({
                query: (queryFilters) => `/kategori_dokumen/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveRegisterDokumen: builder.mutation<IRegisterDokumen<any>, Partial<IRegisterDokumen<any>>>({
                query: (kategoriDokumen) => ({
                    url: '/register_dokumen',
                    method: 'POST',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result) => result ?['RegisterDokumen']:['Kosong'],
            }),
            updateRegisterDokumen: builder.mutation<IRegisterDokumen<any>, Partial<IRegisterDokumen<any>>>({
                query: (kategoriDokumen) => ({
                    url: '/register_dokumen',
                    method: 'PUT',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result) => result ?['RegisterDokumen']:['Kosong'],
            }),
            updateIdRegisterDokumen: builder.mutation<IRegisterDokumen<any>, {id: string; kategoriDokumen: IRegisterDokumen<any>}>({
                query: ({id, kategoriDokumen}) => ({
                    url: `/register_dokumen/id/${id}`,
                    method: 'PUT',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result) => result ?['RegisterDokumen']:['Kosong'],
            }),
            deleteRegisterDokumen: builder.mutation<Partial<IRegisterDokumen<any>>, Partial<IRegisterDokumen<any>>>({
                query(registerDokumen) {
                  return {
                    url: `/register_dokumen/${registerDokumen.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ?['RegisterDokumen']:['Kosong'],
            }),
            getDaftarDataRegisterDokumen: builder.query<IRegisterDokumen<any>[], IQueryParamFilters>({
                query: (queryParams) => `/register_dokumen?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['RegisterDokumen'],
            }),
            getJumlahDataRegisterDokumen: builder.query<number, qFilters>({
                query: (queryFilters) => `/register_dokumen/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKbli: builder.mutation<IKbli, Partial<IKbli>>({
                query: (kbli) => ({
                    url: '/kbli',
                    method: 'POST',
                    body: kbli,
                }),
                invalidatesTags: (result) => result ?['Kbli']:['Kosong'],
            }),
            updateKbli: builder.mutation<IKbli, Partial<IKbli>>({
                query: (kbli) => ({
                    url: '/kbli',
                    method: 'PUT',
                    body: kbli,
                }),
                invalidatesTags: (result) => result ?['Kbli']:['Kosong'],
            }),
            updateIdKbli: builder.mutation<IKbli, {kode: string; kbli: IKbli}>({
                query: ({kode, kbli}) => ({
                    url: `kbli/id/${kode}`,
                    method: 'PUT',
                    body: kbli,
                }),
                invalidatesTags: (result) => result ?['Kbli']:['Kosong'],
            }),
            deleteKbli: builder.mutation<Partial<IKbli>, Partial<IKbli>>({
                query(kbli) {
                  return {
                    url: `/kbli/${kbli.kode}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ?['Kbli']:['Kosong'],
            }),
            getDaftarDataKbli: builder.query<IKbli[], IQueryParamFilters>({
                query: (queryParams) => `/kbli?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Kbli'],
            }),
            getJumlahDataKbli: builder.query<number, qFilters>({
                query: (queryFilters) => `/kbli/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveRegisterKbli: builder.mutation<IRegisterKbli, Partial<IRegisterKbli>>({
                query: (registerKbli) => ({
                    url: '/register_kbli',
                    method: 'POST',
                    body: registerKbli,
                }),
                invalidatesTags: (result) => result ?['RegisterKbli']:['Kosong'],
            }),
            updateRegisterKbli: builder.mutation<IRegisterKbli, Partial<IRegisterKbli>>({
                query: (registereKbli) => ({
                    url: '/register_kbli',
                    method: 'PUT',
                    body: registereKbli,
                }),
                invalidatesTags: (result) => result ?['RegisterKbli']:['Kosong'],
            }),
            updateIdRegisterKbli: builder.mutation<IRegisterKbli, {idNibLama: String; idKbliLama: string; registerKbli: IRegisterKbli}>({
                query: ({idNibLama, idKbliLama, registerKbli}) => ({
                    url: `register_kbli/${idNibLama}/${idKbliLama}`,
                    method: 'PUT',
                    body: registerKbli,
                }),
                invalidatesTags: (result) => result ?['RegisterKbli']:['Kosong'],
            }),
            deleteRegisterKbli: builder.mutation<Partial<IRegisterKbli>, {idNibLama: String; idKbliLama: string; registerKbli: Partial<IRegisterKbli>}>({
                query({idNibLama, idKbliLama}) {
                  return {
                    url: `/register_kbli/${idNibLama}/${idKbliLama}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ?['RegisterKbli']:['Kosong'],
            }),
            getDaftarDataRegisterKbli: builder.query<IRegisterKbli[], IQueryParamFilters>({
                query: (queryParams) => `/register_kbli?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['RegisterKbli'],
            }),
            getJumlahDataRegisterKbli: builder.query<number, qFilters>({
                query: (queryFilters) => `/register_kbli/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveRegisterOtoritas: builder.mutation<IOtoritas, FormData>({
                query: (dataForm) => ({
                    url: '/otoritas',
                    method: 'POST',
                    body: dataForm
                }),
                invalidatesTags: (result) => result ? ['Otoritas']:['Kosong'],
            }),
            updateRegisterOtoritas: builder.mutation<void, FormData>({
                query: (dataForm) => ({
                    url: '/otoritas',
                    method: 'PUT',
                    body: dataForm
                }),
                invalidatesTags: (result) => result ? ['Otoritas']:['Kosong'],
            }),
            updateIdRegisterOtoritas: builder.mutation<IOtoritas, {idLama: string; otoritas: Partial<IOtoritas>}>({
                query: ({idLama, otoritas}) => ({
                    url: `/otoritas/id/${idLama}`,
                    method: 'PUT',
                    body: otoritas,
                }),
                invalidatesTags: (result) => result ? ['Otoritas']:['Kosong'],
            }),
            deleteRegisterOtoritas: builder.mutation<Partial<IOtoritas>, Partial<IOtoritas>>({
                query(otoritas) {
                  return {
                    url: `/otoritas/${otoritas.id}`,
                    method: 'DELETE'
                  }
                },
                invalidatesTags: (result) => result ? ['Otoritas']:['Kosong'],
            }),
            getDaftarDataRegisterOtoritas: builder.query<IOtoritas[], IQueryParamFilters>({
                query: (queryParams) => `/otoritas?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Otoritas'],
            }),
            getJumlahDataRegisterOtoritas: builder.query<number, qFilters>({
                query: (queryFilters) => `/otoritas/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveRegisterOtoritasPerusahaan: builder.mutation<IOtoritasPerusahaan, Partial<IOtoritasPerusahaan>>({
                query: (otoritasPerusahaan) => ({
                    url: '/otoritas_perusahaan',
                    method: 'POST',
                    body: otoritasPerusahaan
                }),
                invalidatesTags: (result) => result ? ['OtoritasPerusahaan']:['Kosong'],
            }),
            updateRegisterOtoritasPerusahaan: builder.mutation<IOtoritasPerusahaan, Partial<IOtoritasPerusahaan>>({
                query: (otoritasPerusahaan) => ({
                    url: '/otoritas_perusahaan',
                    method: 'PUT',
                    body: otoritasPerusahaan,
                }),
                invalidatesTags: (result) => result ? ['OtoritasPerusahaan']:['Kosong'],
            }),
            updateIdRegisterOtoritasPerusahaan: builder.mutation<IOtoritasPerusahaan, {idRegisterOtoritasLama: String; idRegisterPerusahaanLama: string; registerOtoritasPerusahaan: IOtoritasPerusahaan}>({
                query: ({idRegisterOtoritasLama, idRegisterPerusahaanLama, registerOtoritasPerusahaan}) => ({
                    url: `/otoritas_perusahaan/${idRegisterOtoritasLama}/${idRegisterPerusahaanLama}`,
                    method: 'PUT',
                    body: registerOtoritasPerusahaan,
                }),
                invalidatesTags: (result) => result ?['OtoritasPerusahaan']:['Kosong'],
            }),
            deleteRegisterOtoritasPerusahaan: builder.mutation<Partial<IOtoritasPerusahaan>, Partial<IOtoritasPerusahaan>>({
                query(otoritasPerusahaan) {
                  return {
                    url: `/otoritas_perusahaan/${otoritasPerusahaan.otoritas?.id}/${otoritasPerusahaan.registerPerusahaan?.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ?['OtoritasPerusahaan']:['Kosong'],
            }),
            getDaftarDataRegisterOtoritasPerusahaan: builder.query<IOtoritasPerusahaan[], IQueryParamFilters>({
                query: (queryParams) => `/otoritas_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['OtoritasPerusahaan'],
            }),
            getJumlahDataRegisterOtoritasPerusahaan: builder.query<number, qFilters>({
                query: (queryFilters) => `/otoritas_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKategoriFlowLog: builder.mutation<IKategoriFlowLog, Partial<IKategoriFlowLog>>({
                query: (body) => ({
                    url: '/kategori_log',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result ? ['KategoriFlowLog']:['Kosong'],
            }),
            updateKategoriFlowLog: builder.mutation<IKategoriFlowLog, Partial<IKategoriFlowLog>>({
                query: (kategoriFlowLog) => ({
                    url: '/kategori_log',
                    method: 'PUT',
                    body: kategoriFlowLog,
                }),
                invalidatesTags: (result) => result ? ['KategoriFlowLog']:['Kosong'],
            }),
            updateIdKategoriFlowLog: builder.mutation<IKategoriFlowLog, {idLama: string; kategoriFlowLog: Partial<IKategoriFlowLog>}>({
                query: ({idLama, kategoriFlowLog}) => ({
                    url: `/kategori_log/id/${idLama}`,
                    method: 'PUT',
                    body: kategoriFlowLog,
                }),
                invalidatesTags: (result) => result ? ['KategoriFlowLog']:['Kosong'],
            }),
            deleteKategoriFlowLog: builder.mutation<Partial<IKategoriFlowLog>, Partial<IKategoriFlowLog>>({
                query(kategoriFlowLog) {
                  return {
                    url: `/kategori_log/${kategoriFlowLog.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['KategoriFlowLog']:['Kosong'],
            }),
            getDaftarDataKategoriFlowLog: builder.query<IKategoriFlowLog[], IQueryParamFilters>({
                query: (queryParams) => `/kategori_log?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['KategoriFlowLog'],
            }),
            getJumlahDataKategoriFlowLog: builder.query<number, qFilters>({
                query: (queryFilters) => `/kategori_log/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveStatusFlowLog: builder.mutation<IStatusFlowLog, Partial<IStatusFlowLog>>({
                query: (body) => ({
                    url: '/status_flow_log',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result ? ['StatusFlowLog']:['Kosong'],
            }),
            updateStatusFlowLog: builder.mutation<IStatusFlowLog, Partial<IStatusFlowLog>>({
                query: (statusFlowLog) => ({
                    url: '/status_flow_log',
                    method: 'PUT',
                    body: statusFlowLog,
                }),
                invalidatesTags: (result) => result ?['StatusFlowLog']:['Kosong'],
            }),
            updateIdStatusFlowLog: builder.mutation<IStatusFlowLog, {idLama: string; statusFlowLog: Partial<IStatusFlowLog>}>({
                query: ({idLama, statusFlowLog}) => ({
                    url: `/status_flow_log/id/${idLama}`,
                    method: 'PUT',
                    body: statusFlowLog,
                }),
                invalidatesTags: (result) => result ? ['StatusFlowLog']:['Kosong'],
            }),
            deleteStatusFlowLog: builder.mutation<Partial<IStatusFlowLog>, Partial<IStatusFlowLog>>({
                query(statusFlowLog) {
                  return {
                    url: `/status_flow_log/${statusFlowLog.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['StatusFlowLog']:['Kosong'],
            }),
            getDaftarDataStatusFlowLog: builder.query<IStatusFlowLog[], IQueryParamFilters>({
                query: (queryParams) => `/status_flow_log?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['StatusFlowLog'],
            }),
            getJumlahDataStatusFlowLog: builder.query<number, qFilters>({
                query: (queryFilters) => `/status_flow_log/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKategoriPermohonan: builder.mutation<IKategoriPermohonan, Partial<IKategoriPermohonan>>({
                query: (body) => ({
                    url: '/kategori_permohonan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result ? ['KategoriPermohonan']:['Kosong'],
            }),
            updateKategoriPermohonan: builder.mutation<IKategoriPermohonan, Partial<IKategoriPermohonan>>({
                query: (kategoriPermohonan) => ({
                    url: '/kategori_permohonan',
                    method: 'PUT',
                    body: kategoriPermohonan,
                }),
                invalidatesTags: (result) => result ? ['KategoriPermohonan']:['Kosong'],
            }),
            updateIdKategoriPermohonan: builder.mutation<IKategoriPermohonan, {idLama: string; kategoriPermohonan: Partial<IKategoriPermohonan>}>({
                query: ({idLama, kategoriPermohonan}) => ({
                    url: `/kategori_permohonan/id/${idLama}`,
                    method: 'PUT',
                    body: kategoriPermohonan,
                }),
                invalidatesTags: (result) => result ? ['KategoriPermohonan']:['Kosong'],
            }),
            deleteKategoriPermohonan: builder.mutation<Partial<IStatusFlowLog>, Partial<IStatusFlowLog>>({
                query(kategoriPermohonan) {
                  return {
                    url: `/kategori_permohonan/${kategoriPermohonan.id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result ? ['KategoriPermohonan']:['Kosong'],
            }),
            getDaftarDataKategoriPermohonan: builder.query<IStatusFlowLog[], IQueryParamFilters>({
                query: (queryParams) => `/kategori_permohonan?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['KategoriPermohonan'],
            }),
            getJumlahDataKategoriPermohonan: builder.query<number, qFilters>({
                query: (queryFilters) => `/kategori_permohonan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            logout: builder.mutation<string, string>({
                query(sessionId) {
                  return {
                    url: `/user/${sessionId}`,
                    method: 'DELETE'
                  }
                },                
                // invalidatesTags: (result) => result ? ['Otoritas']:['Kosong'],
            }),
            uploadFile: builder.mutation<{uri:string}, {subPath: string; dataForm:FormData}>({
                query: ({subPath, dataForm}) => ({
                    url: encodeURI(subPath),
                    method: 'POST',
                    body: dataForm,
                }),
                invalidatesTags: (result) => result ? ['RegisterDokumen']:['Kosong']
            }),
            deleteFile: builder.mutation<{hasil:string}, string>({
                query: (subPath) => ({
                    url: encodeURI(subPath),
                    method: 'DELETE',
                }),
            }),
            getOnlyofficeConfigEditor: builder.mutation<any, string>({
                query: (subPath) => ({
                    url: encodeURI(subPath),
                    method: 'GET',
                }),
                invalidatesTags: (result) => result ? ['ConfigEditor']:['Kosong']
            }),
        }
    }
});

export const {
    useGetDataImageQuery,
    useSaveJenisKelaminMutation, useUpdateJenisKelaminMutation, useUpdateIdJenisKelaminMutation,
    useDeleteJenisKelaminMutation,useGetDaftarDataJenisKelaminQuery, useGetJumlahDataJenisKelaminQuery,
    useSavePropinsiMutation, useUpdatePropinsiMutation, useUpdateIdPropinsiMutation,
    useDeletePropinsiMutation,useGetDaftarDataPropinsiQuery, useGetJumlahDataPropinsiQuery,
    useSaveKabupatenMutation, useUpdateKabupatenMutation, useUpdateIdKabupatenMutation,
    useDeleteKabupatenMutation,useGetDaftarDataKabupatenQuery, useGetJumlahDataKabupatenQuery,
    useSaveKecamatanMutation, useUpdateKecamatanMutation, useUpdateIdKecamatanMutation,
    useDeleteKecamatanMutation,useGetDaftarDataKecamatanQuery, useGetJumlahDataKecamatanQuery,
    useSaveDesaMutation, useUpdateDesaMutation, useUpdateIdDesaMutation,
    useDeleteDesaMutation,useGetDaftarDataDesaQuery, useGetJumlahDataDesaQuery,
    useSavePersonMutation, useUpdatePersonMutation, useUpdateIdPersonMutation,
    useDeletePersonMutation, useGetDaftarDataPersonQuery, useGetJumlahDataPersonQuery,
    useSaveHakAksesMutation, useUpdateHakAksesMutation, useUpdateIdHakAksesMutation,
    useDeleteHakAksesMutation, useGetDaftarDataHakAksesQuery, useGetJumlahDataHakAksesQuery,
    useSavePegawaiMutation, useUpdatePegawaiMutation, useUpdateIdPegawaiMutation,
    useDeletePegawaiMutation, useGetDaftarDataPegawaiQuery, useGetJumlahDataPegawaiQuery,
    useSaveRegisterPerusahaanMutation, useUpdateRegisterPerusahaanMutation, useUpdateIdRegisterPerusahaanMutation,
    useDeleteRegisterPerusahaanMutation, useGetDaftarDataRegisterPerusahaanQuery, useGetJumlahDataRegisterPerusahaanQuery,
    useSaveJabatanMutation, useUpdateJabatanMutation, useUpdateIdJabatanMutation,
    useDeleteJabatanMutation, useGetDaftarDataJabatanQuery, useGetJumlahDataJabatanQuery,
    useSaveModelPerizinanMutation, useUpdateModelPerizinanMutation, useUpdateIdModelPerizinanMutation,
    useDeleteModelPerizinanMutation, useGetDaftarDataModelPerizinanQuery, useGetJumlahDataModelPerizinanQuery,
    useSaveSkalaUsahaMutation, useUpdateSkalaUsahaMutation, useUpdateIdSkalaUsahaMutation,
    useDeleteSkalaUsahaMutation, useGetDaftarDataSkalaUsahaQuery, useGetJumlahDataSkalaUsahaQuery,
    useSaveKategoriPelakuUsahaMutation, useUpdateKategoriPelakuUsahaMutation, useUpdateIdKategoriPelakuUsahaMutation,
    useDeleteKategoriPelakuUsahaMutation, useGetDaftarDataKategoriPelakuUsahaQuery, useGetJumlahDataKategoriPelakuUsahaQuery,
    useSavePelakuUsahaMutation, useUpdatePelakuUsahaMutation, useUpdateIdPelakuUsahaMutation,
    useDeletePelakuUsahaMutation, useGetDaftarDataPelakuUsahaQuery, useGetJumlahDataPelakuUsahaQuery,
    useSaveDokumenMutation, useUpdateDokumenMutation, useUpdateIdDokumenMutation,
    useDeleteDokumenMutation, useGetDaftarDataDokumenQuery, useGetJumlahDataDokumenQuery,
    useSaveKategoriDokumenMutation, useUpdateKategoriDokumenMutation, useUpdateIdKategoriDokumenMutation,
    useDeleteKategoriDokumenMutation, useGetDaftarDataKategoriDokumenQuery, useGetJumlahDataKategoriDokumenQuery,
    useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation, useUpdateIdRegisterDokumenMutation,
    useDeleteRegisterDokumenMutation, useGetDaftarDataRegisterDokumenQuery, useGetJumlahDataRegisterDokumenQuery,
    useSaveKbliMutation, useUpdateKbliMutation, useUpdateIdKbliMutation,
    useDeleteKbliMutation, useGetDaftarDataKbliQuery, useGetJumlahDataKbliQuery,
    useSaveRegisterKbliMutation, useUpdateRegisterKbliMutation, useUpdateIdRegisterKbliMutation,
    useDeleteRegisterKbliMutation, useGetDaftarDataRegisterKbliQuery, useGetJumlahDataRegisterKbliQuery,
    useSaveRegisterOtoritasPerusahaanMutation, useUpdateRegisterOtoritasPerusahaanMutation, useUpdateIdRegisterOtoritasPerusahaanMutation,
    useDeleteRegisterOtoritasPerusahaanMutation, useGetDaftarDataRegisterOtoritasPerusahaanQuery, useGetJumlahDataRegisterOtoritasPerusahaanQuery,
    useSaveRegisterOtoritasMutation, useUpdateRegisterOtoritasMutation, useUpdateIdRegisterOtoritasMutation,
    useDeleteRegisterOtoritasMutation, useGetDaftarDataRegisterOtoritasQuery, useGetJumlahDataRegisterOtoritasQuery,
    useSaveKategoriFlowLogMutation, useUpdateKategoriFlowLogMutation, useUpdateIdKategoriFlowLogMutation,
    useDeleteKategoriFlowLogMutation, useGetDaftarDataKategoriFlowLogQuery, useGetJumlahDataKategoriFlowLogQuery,
    useSaveStatusFlowLogMutation, useUpdateStatusFlowLogMutation, useUpdateIdStatusFlowLogMutation,
    useDeleteStatusFlowLogMutation, useGetDaftarDataStatusFlowLogQuery, useGetJumlahDataStatusFlowLogQuery,
    useSaveKategoriPermohonanMutation, useUpdateKategoriPermohonanMutation, useUpdateIdKategoriPermohonanMutation,
    useDeleteKategoriPermohonanMutation, useGetDaftarDataKategoriPermohonanQuery, useGetJumlahDataKategoriPermohonanQuery,
    useUploadFileMutation, useGetOnlyofficeConfigEditorMutation, useDeleteFileMutation, 
    useAddDirekturMutation, useLogoutMutation,
} = sikolingApi;