const CekTypeFile = (mime: string) => {
    mime = mime.toLowerCase();
    let hasil: string;
    switch (mime) {
        case 'image/bmp':
        case 'image/svg+xml':
        case 'image/jpeg':
        case 'image/tiff':
        case 'image/gif':
        case 'image/png':
            hasil = 'image'
            break;
        case 'application/pdf':
            hasil = 'pdf';
            break;
        case 'application/msword':
            hasil = 'doc';
            break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            hasil = 'docx';
            break;
        case 'application/vnd.ms-powerpoint':
            hasil = 'ppt';
            break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            hasil = 'pptx';
            break;
        case 'application/vnd.ms-excel':
            hasil = 'xls';
            break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            hasil = 'xlsx'
            break;
        default:
            hasil = 'tidak terdefinisi';
            break;
    }        

    return hasil;
}

export default CekTypeFile;