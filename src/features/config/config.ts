import { IHalamanBasePageAndPageSize as IHalaman } from "../halaman/pagging";
import { IJenisKelamin } from "../entity/jenis-kelamin";
import { IDatePickerStrings } from "@fluentui/react";

export const sikolingBaseRestAPIUrl:string = 'http://localhost:8080/Sikoling-web/api';
// export const baseIdentityProviderUrl = 'http://localhost:8082/';
export const defaultHalaman: IHalaman = {page: 1, pageSize: 10};
export const defaultJenisKelamin: IJenisKelamin = {id: 'L', nama: 'Laki-Laki'};
export const regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
export const regexpPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
export const regexpNomorTelepone = new RegExp(/^\+?([-]?\d+)+|\(\d+\)([-]\d+)/);
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
    return !date ? '' : addZeroDigitInFront(date.getDate()) + '-' + addZeroDigitInFront(date.getMonth() + 1) + '-' + date.getFullYear();
};
export const onFormatDateUtc = (date?: Date) => {
    return !date ? '' : date.getFullYear() + '-' + addZeroDigitInFront(date.getMonth() + 1) + '-' + addZeroDigitInFront(date.getDate());
};
export const flipFormatDate = (tglStr?: string) => {
    if(tglStr != undefined) {
        let tgl = tglStr?.split("-");
        return `${tgl![2]}-${tgl![1]}-${tgl![0]}`;    
    }
};
const addZeroDigitInFront = (bilangan: number) => {
    if(bilangan < 10) {
        return `0${bilangan}`;
    }
    else {
        return `${bilangan}`;
    }
}
// export const importScript = (resourceUrl: string) => {
//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = resourceUrl;
//         script.async = true;
//         document.body.appendChild(script);
//         return () => {
//             document.body.removeChild(script);
//         }
//     }, [resourceUrl]);
// };