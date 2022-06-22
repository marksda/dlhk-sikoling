import { IDesa } from "../desa/desa-slice"
import { IKabupaten } from "../kabupaten/kabupaten-slice"
import { IKecamatan } from "../kecamatan/kecamatan-slice"
import { IPropinsi } from "../propinsi/propinsi-slice"


export const baseUrl:string = 'http://localhost:8080/Sikoling-web/api'
export const defaultPropinsi: IPropinsi = {id: '35', nama: 'JAWA TIMUR'}
export const defaultKabupaten: IKabupaten = {id:'3515', nama: 'SIDOARJO'}
export const defaultKecamatan: IKecamatan = {id: '3515110', nama: 'SIDOARJO'}
export const defaultDesa: IDesa ={id: '3515110020', nama: 'CEMENG KALANG'}