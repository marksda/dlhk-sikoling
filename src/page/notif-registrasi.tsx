import { DefaultButton, DefaultEffects, DefaultPalette, IStackItemStyles, IStackStyles, IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./header";


const containerStackTokens: IStackTokens = { childrenGap: 5};
const containerBodyStackTokens: IStackTokens = { childrenGap: 5};
const stackTokens = { childrenGap: 2 };
const stackBodyStyles: IStackStyles = {
    root: {
      paddingLeft: 16,
      paddingRight: 16,
    },
};
const containerStyles: React.CSSProperties = {
    boxShadow: DefaultEffects.elevation4,
    borderTop: '2px solid green', 
    // borderRadius: 3, 
    padding: 32,
    width: 400,
    height: 200,
    marginTop: 64,
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'white',
};
const labelTitleStyles: IStackItemStyles = {
    root: {
        color: DefaultPalette.black,
        fontSize: '1.2em',
        fontWeight: 600,      
        textAlign: 'justify',
    },
};

export const NotifikasiRegistrasi: FC = () => {
    //react router
    const navigate = useNavigate();
    
    return (
        <Stack tokens={containerStackTokens} >
            <Header />
            <Stack horizontal reversed tokens={containerBodyStackTokens} styles={stackBodyStyles}>
                <div style={containerStyles}>
                    <Stack tokens={containerStackTokens}>
                        <Stack.Item align="center">
                            <Label  styles={labelTitleStyles}>Info Registrasi</Label>
                        </Stack.Item> 
                        <Stack.Item align="center" styles={labelTitleStyles}>
                            <Label>
                                Registrasi akun berhasil ditambahkan kedalam sistem sikoling. Petugas akan melakukan verifikasi dalam tempo 1 x 24 jam. Jika proses verifikasi selesai, email pemberitahuan dikirim ke alamat email yang dipakai saat registrasi.
                            </Label>
                        </Stack.Item>
                    </Stack>
                    <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                        <DefaultButton 
                            text="Tutup" 
                            style={{marginTop: 24, width: 120}}
                            onClick={
                                () => {
                                    navigate("/");
                                }
                            }
                            />
                    </Stack>
                </div>
            </Stack>             
        </Stack>
    );
}