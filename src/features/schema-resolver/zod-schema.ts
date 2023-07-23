import { object, z } from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

export const JenisKelaminSchema = object({
    id: z.string().optional(),
    nama: z.string().optional()
});

export const PropinsiSchema = object({
    id: z.string().nullable(),
    nama: z.string().nullable(),
});

export const KabupatenSchema = object({
    id: z.string().nullable(),
    nama: z.string().nullable(),
    propinsi: PropinsiSchema.nullable(),
});

export const KecamatanSchema = object({
    id: z.string().nullable(),
    nama: z.string().nullable(),
    kabupaten: KabupatenSchema.nullable(),
});

export const DesaSchema = object({
    id: z.string().nullable(),
    nama: z.string().nullable(),
    kecamatan: KecamatanSchema.nullable(),
});

export const AlamatSchema = object({
    propinsi: PropinsiSchema.nullable(),
    kabupaten: KabupatenSchema.nullable(),
    kecamatan: KecamatanSchema.nullable(),
    desa: DesaSchema.nullable(),
    keterangan: z.string().nullable(),
});

export const KontakSchema = object({
    fax: z.string().nullable().optional(),
    telepone: z.string().min(7, { message: "minimal 7 digit" }).regex(phoneRegex, 'format salah'),
    email: z.string().min(4, { message: "Harus diisi" }).email("bukan format email yang benar").nullable(),
})

export const PersonSchema = object({
    nik: z.string().regex(/^\d+$/, 'format salah').length(16, 'harus 16 digit'),
    nama: z.string().nullable(),
    jenisKelamin: JenisKelaminSchema.nullable(),
    alamat: AlamatSchema.nullable(),
    kontak: KontakSchema.nullable(),
    scanKTP: z.string()
});

export const HakAksesSchema = object({
    id: z.string().nullable(),
    nama: z.string().nullable(),
    keterangan: z.string().nullable()
});

export const OtoritasSchema = object({
    id: z.string().nullable(),
    tanggal: z.string().nullable(),
    hakAkses: HakAksesSchema.optional(),
    person: PersonSchema.optional(),
    statusInternal: z.boolean().nullable(),
    userName: z.string().optional(),
    isVerified: z.boolean().nullable(),
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
    id: z.string().length(15, 'Format npwp salah'),
    nama: z.string().min(1, "Harus diisi"),    
    modelPerizinan: ModelPerizinanSchema.optional(),
    skalaUsaha: SkalaUsahaSchema.optional(),
    pelakuUsaha: PelakuUsahaSchema.optional(),
    alamat: AlamatSchema.optional(),
    kontak: KontakSchema.optional()
});

export const RegisterPerusahaanSchema = object({
    id: z.string().nullable(),
    tanggalRegistrasi: z.string().nullable(),
    kreator: OtoritasSchema.pick({id: true}),
    verifikator: OtoritasSchema.pick({id: true}),
    perusahaan: PerusahaanSchema.nullable(),
    statusVerifikasi: z.boolean().nullable()
});

export const OtoritasPerusahaanSchema = object({
    otoritas: OtoritasSchema.required(),
    registerPerusahaan: RegisterPerusahaanSchema.required(),
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
    id: z.string(),
    nama: z.string(),
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

export const PegawaiSchema = DokumenSchema.extend({
    id: z.string().nullable(),
    registerPerusahaan: RegisterPerusahaanSchema.pick({id: true}),
    person: PersonSchema.pick({nik: true}),
    jabatan: JabatanSchema.pick({id:true})
});