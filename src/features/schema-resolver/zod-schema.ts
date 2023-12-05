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
    propinsi: PropinsiSchema.pick({id: true}),
});

export const KecamatanSchema = object({
    id: z.string().nullable(),
    nama: z.string().nullable(),
    kabupaten: KabupatenSchema.pick({id: true}),
});

export const DesaSchema = object({
    id: z.string().nullable(),
    nama: z.string().nullable(),
    kecamatan: KecamatanSchema.nullable(),
});

export const AlamatSchema = object({
    propinsi: PropinsiSchema.pick({id: true}),
    kabupaten: KabupatenSchema.pick({id: true}),
    kecamatan: KecamatanSchema.pick({id: true}),
    desa: DesaSchema.pick({id: true}),
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
    statusVerified: z.boolean(),
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
    tanggal: z.string().optional(),
    hakAkses: HakAksesSchema,
    person: PersonSchema,
    userName: z.string().email(),
    isVerified: z.boolean().nullable(),
});

export const ModelPerizinanSchema = object({
    id: z.string().nullable(),
    nama: z.string(),
    singkatan: z.string()
});

export const SkalaUsahaSchema = object({
    id: z.string().nullable(),
    nama: z.string(),
    singkatan: z.string()
});

export const KategoriPelakuUsahaSchema = object({
    id: z.string().nullable(),
    nama: z.string(),
    skalaUsaha: SkalaUsahaSchema.pick({id:true})
});

export const PelakuUsahaSchema = object({
    id: z.string().nullable(),
    nama: z.string(),
    singkatan: z.string(),
    kategoriPelakuUsaha: KategoriPelakuUsahaSchema.required()
});

export const PerusahaanSchema = object({
    id: z.string().regex(/^\d+$/, 'tidak boleh ada abjad').min(15, 'minimal 15 digit'),
    nama: z.string().min(3, "Harus diisi"),    
    modelPerizinan: ModelPerizinanSchema.pick({id: true}),
    skalaUsaha: SkalaUsahaSchema.pick({id: true}),
    pelakuUsaha: PelakuUsahaSchema.pick({id: true}),
    alamat: AlamatSchema.nullable(),
    kontak: KontakSchema.nullable()
});

export const RegisterPerusahaanSchema = object({
    id: z.string().nullable(),
    tanggalRegistrasi: z.string().nullable(),
    kreator: OtoritasSchema.pick({id: true}).nullable(),
    // verifikator: OtoritasSchema.optional(),
    perusahaan: PerusahaanSchema,
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

export const StatusWaliPermohonanSchema = object({
    id: z.string().nullable(),
    nama: z.string()
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

export const PegawaiSchema = object({
    id: z.string().nullable(),
    registerPerusahaan: RegisterPerusahaanSchema.pick({id: true}),
    person: PersonSchema.pick({nik: true}),
    jabatan: JabatanSchema.pick({id:true})
});

// export const DaftarDokumen = z.array(RegisterDokumenSchema);

export const FileDokumenUploadSchema = object({
    dokumenFile: z.instanceof(File),
    dokumenFiless: z.array(z.instanceof(File))
});

export const KategoriDokumenSchema = object({
    id: z.string(),
    nama: z.string(),
    parent: z.string()
});

export const DokumenSchema = object({
    id: z.string(),
    nama: z.string().nullable(),
    kategoriDokumen: KategoriDokumenSchema.pick({id:true})
});

export const KbliSchema = object({
    kode: z.string().nullable(),
    nama: z.string(),
    kategori: z.string(),
});

export const DokumenNibSchema = DokumenSchema.extend({
    nomor: z.string(),
    tanggal:z.string(),
    daftarKbli: z.array(KbliSchema.pick({kode: true})).nonempty()
});

export const DokumenAktaPendirianSchema = DokumenSchema.pick({id: true}).extend({
    nomor: z.string(),
    tanggal:z.string(),
    namaNotaris: z.string(),
    penanggungJawab: PegawaiSchema.pick({id: true}),
});

export const DokumenGenerikSchema = DokumenSchema.pick({id: true}).extend({
    nomor: z.string(),
    tanggal:z.string(),
});

export const RegisterKbliSchema = object({
    idNib: z.string().optional(),
    idKbli: z.string().optional(),
    nama: z.string().optional()
});

export const RegisterDokumenSchema = object({
    id: z.string().nullable(),
    // dokumen: DokumenSchema,
    registerPerusahaan: RegisterPerusahaanSchema.pick({id:true}),
    lokasiFile: z.string().nullable(),
    tanggalRegistrasi: z.string().optional(),
    uploader: OtoritasSchema.pick({id:true}).optional(),
    statusVerified: z.boolean().optional()
});

export const RegisterDokumenAktaPendirianSchema = RegisterDokumenSchema.extend({dokumen: DokumenAktaPendirianSchema});
export const RegisterDokumenNibSchema = RegisterDokumenSchema.extend({dokumen: DokumenNibSchema});
export const RegisterDokumenGenerikSchema = RegisterDokumenSchema.extend({dokumen: DokumenGenerikSchema});

export const StatusFlowLogSchema = object({
    id: z.string().nullable(),
    nama: z.string(),
});

export const KategoriFlowLogSchema = object({
    id: z.string().nullable(),
    nama: z.string(),
});

export const KategoriPermohonanSchema = object({
    id: z.string().nullable(),
    nama: z.string(),
});

// export const DaftarKbliSchema = z.array(RegisterKbliSchema);

