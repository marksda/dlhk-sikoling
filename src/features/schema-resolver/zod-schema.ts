import { object, z } from "zod";

export const JenisKelaminSchema = object({
    id: z.string().optional(),
    nama: z.string().optional()
});

export const PropinsiSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
});

export const KabupatenSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
});

export const KecamatanSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
});

export const DesaSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
});

export const AlamatSchema = object({
    propinsi: PropinsiSchema.optional(),
    kabupaten: KabupatenSchema.optional(),
    kecamatan: KecamatanSchema.optional(),
    desa: DesaSchema.optional(),
    keterangan: z.string().optional(),
});

export const KontakSchema = object({
    fax: z.string().optional(),
    telepone: z.string().optional(),
    email: z.string().min(1, { message: "Harus diisi" }).email("bukan format email yang benar").optional(),
})

export const PersonSchema = object({
    nik: z.string().optional(),
    nama: z.string().optional(),
    jenisKelamin: JenisKelaminSchema.optional(),
    alamat: AlamatSchema.optional(),
    kontak: KontakSchema.optional(),
    scanKTP: z.string().optional()
});

export const HakAksesSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
    keterangan: z.string().optional()
});

export const AuthoritySchema = object({
    hakAkses: HakAksesSchema.optional(),
    person: PersonSchema.optional(),
    statusInternal: z.boolean().optional(),
    userName: z.string().optional(),
    verified: z.boolean().optional()
});

export const ModelPerizinanSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
    singkatan: z.string().optional()
});

export const SkalaUsahaSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
    singkatan: z.string().optional()
});

export const KategoriPelakuUsahaSchema = object({
    id: z.string().optional(),
    nama: z.string().optional()
});

export const PelakuUsahaSchema = object({
    id: z.string(),
    nama: z.string(),
    singkatan: z.string(),
    kategoriPelakuUsaha: KategoriPelakuUsahaSchema.optional()
});

export const PerusahaanSchema = object({
    id: z.string().length(20, 'Format npwp salah'),
    nama: z.string().min(1, "Harus diisi"),
    modelPerizinan: ModelPerizinanSchema.required(),
    skalaUsaha: SkalaUsahaSchema.required(),
    pelakuUsaha: PelakuUsahaSchema.required(),
    alamat: AlamatSchema.optional(),
    kontak: KontakSchema.optional()
});

export const RegisterPerusahaanSchema = object({
    id: z.string().optional(),
    tanggalRegistrasi: z.string().optional(),
    kreator: AuthoritySchema.optional(),
    verifikator: AuthoritySchema.optional(),
    perusahaan: PerusahaanSchema.required(),
    statusVerifikasi: z.boolean().optional()
});

export const JenisPermohonanArahanSchema = object({
    id: z.string().optional(),
    keterangan: z.string().optional()
});

export const StatusWaliSchema = object({
    id: z.string().optional(),
    nama: z.string().optional()
});

export const JabatanSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
})

export const PenanggungJawabSchema =  object({
    id: z.string().optional(),
    jabatan: JabatanSchema,
    person: PersonSchema
});

export const RegisterDokumenSchema = object({
    id: z.string().optional(),
    dokumen: z.any().optional(),
    registerPerusahaan: RegisterPerusahaanSchema.optional(),
    lokasiFile: z.string().optional(),
    tanggalRegistrasi: z.string().optional(),
    uploader: PersonSchema.optional()
});

export const DaftarDokumen = z.array(RegisterDokumenSchema);

export const FileDokumenUploadSchema = object({
    dokumenFile: z.instanceof(File),
    dokumenFiless: z.array(z.instanceof(File))
});

export const KategoriDokumenSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
    parent: z.string().optional()
});

export const DokumenSchema = object({
    id: z.string().optional(),
    nama: z.string().optional(),
    kategoriDokumen: KategoriDokumenSchema.optional(),
});

export const RegisterKbliSchema = object({
    idNib: z.string().optional(),
    idKbli: z.string().optional(),
    nama: z.string().optional()
});

export const DaftarKbliSchema = z.array(RegisterKbliSchema);

export const DokumenNibSchema = DokumenSchema.extend({
    nomor: z.string().length(13, {message: 'harus 13 digit'}).nullable(),
    tanggal:z.string(),
    daftarKbli: DaftarKbliSchema
});