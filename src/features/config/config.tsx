import { IDesa } from "../desa/desa-slice"
import { IKabupaten } from "../kabupaten/kabupaten-slice"
import { IKecamatan } from "../kecamatan/kecamatan-slice"
import { IPropinsi } from "../propinsi/propinsi-slice"
import { IHalaman } from "../halaman/halaman"
import { IJenisKelamin } from "../jenis-kelamin/jenis-kelamin-slice"
import { IDatePickerStrings } from "@fluentui/react"


export const baseRestAPIUrl:string = 'http://localhost:8080/Sikoling-web/api/';
export const baseIdentityProviderUrl = 'http://localhost:8082/';
export const defaultPropinsi: IPropinsi = {id: '35', nama: 'JAWA TIMUR'};
export const defaultKabupaten: IKabupaten = {id:'3515', nama: 'SIDOARJO'};
export const defaultKecamatan: IKecamatan = {id: '3515110', nama: 'SIDOARJO'};
export const defaultDesa: IDesa ={id: '3515110020', nama: 'CEMENG KALANG'};
export const defaultHalaman: IHalaman = {page: 1, pageSize: 10};
export const defaultJenisKelamin: IJenisKelamin = {id: 'L', nama: 'Laki-Laki'};
export const DayPickerIndonesiaStrings: IDatePickerStrings = {
    months: [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'December'
    ],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    days: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    shortDays: ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'],
    goToToday: 'Hari ini',
    prevMonthAriaLabel: 'Bulan Sebelumnya',
    nextMonthAriaLabel: 'Bulan Selanjutnya',
    prevYearAriaLabel: 'Tahun Sebelumnya',
    nextYearAriaLabel: 'Tahun Berikutnya'
};
export const onFormatDate = (date?: Date) => {
    return !date ? '' : addZeroDigitInFront(date.getDate()) + '/' + addZeroDigitInFront(date.getMonth() + 1) + '/' + date.getFullYear();
};
const addZeroDigitInFront = (bilangan: number) => {
    if(bilangan < 10) {
        return `0${bilangan}`;
    }
    else {
        return `${bilangan}`;
    }
}
