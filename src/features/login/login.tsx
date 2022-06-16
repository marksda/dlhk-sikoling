import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { IPropinsi, setPropinsi } from '../propinsi/propinsi-slice'
// import { useGetUserAutentikasiQuery } from '../../services/sikoling-api'

import { 
    DefaultEffects, ActionButton, IIconProps, Label, PrimaryButton, TextField, Stack, IStackProps, IStackStyles 
} from '@fluentui/react'

const stackTokens = { childrenGap: 2 }
const stackStyles: Partial<IStackStyles> = { root: { width: 300, marginTop: 16 } }
const iconProps: IIconProps = { iconName: 'Contact' }
const addFriendIcon: IIconProps = { iconName: 'AddFriend' }
const helpIcon: IIconProps = { iconName: 'Help' }
const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300, marginTop: 16} },
  }

export const Login: React.FunctionComponent = () => {
    const userProfile = useAppSelector(state => state.login.user_profile);
    const credentialProfile = useAppSelector(state => state.login.credential_profile);
    const headerAuthorization = useAppSelector(state => state.login.header_authorization);
    const propinsi = useAppSelector(state => state.propinsi);

    const dispatch = useAppDispatch();

    function handleClick() {
        dispatch(setPropinsi({id: '02', nama: 'JAWA TENGAH'}));
    }

    // const { data, isFetching } = useGetLoginVerificationQuery();

    return (        
        <div style={{ boxShadow: DefaultEffects.elevation4, padding: 16, width: 300, borderTop: '2px solid orange', borderRadius: 3, margin: 16 }}>
            <Label>Sign in</Label>
            <Stack {...columnProps}>
                <TextField placeholder="Email" iconProps={iconProps} underlined defaultValue={propinsi.nama}/>
                <TextField
                    placeholder="Password"
                    type="password"
                    underlined
                    canRevealPassword
                    revealPasswordAriaLabel="Show password"
                    />        
                <PrimaryButton text='Masuk' onClick={handleClick}/>                
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={stackStyles}>
                <ActionButton iconProps={addFriendIcon}>
                Daftar Akun Baru
                </ActionButton>
                <ActionButton iconProps={helpIcon}>
                Lupa Akun
                </ActionButton>
            </Stack>
        </div>
    )
}