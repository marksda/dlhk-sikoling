import { ActionButton, DefaultButton, FocusTrapZone, FontIcon, getTheme, IconButton, IIconProps, IStackItemStyles, IStackStyles, ITooltipHostStyles, Label, Layer, mergeStyles, mergeStyleSets, Overlay, Popup, PrimaryButton, Stack, TooltipHost } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetToken } from "../../features/security/token-slice";
import { useLogoutMutation } from "../../features/repository/service/sikoling-api-slice";


interface ITopBarUIProps {
    appTitleContainer: {nama: string; width: number;};
    subTitle: string;
};
const theme = getTheme();
const RootStackStyles: IStackStyles = {
    root: {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        lineHeight: '50px',
        // padding: '0 20px',
    },
};
const calloutProps = { gapSpace: 0 };
const userIcon: IIconProps = { iconName: 'Contact',  style: {color: 'white'}};
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
const classNames = mergeStyleSets({
    titleStyles: {
        padding: '0 4px 0 13px',
        fontSize: '1.2em',
        fontWeight: 500,
        borderRight: '1px solid rgb(159 159 159 / 61%)',
    },
    subTitleStyles: {
        padding: '0 4px 0 13px',
        fontSize: '1.2em',
        fontWeight: 500,
    },
    deepSkyBlue: [{ color: 'deepskyblue' }],
    greenYellow: [{ color: 'greenyellow' }],
    salmon: [{ color: 'salmon' }],
    white: [{ color: 'white', marginRight: 16 }],
});
const popupStyles = mergeStyleSets({
    root: {
      background: 'rgba(0, 0, 0, 0.2)',
      bottom: '0',
      left: '0',
      position: 'fixed',
      right: '0',
      top: '0',
    },
    content: {
        borderRadius: 4,
        boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
        background: 'white',
        right: 16,
        maxWidth: '400px',
        padding: '0 2em 2em',
        position: 'absolute',
        top: 42,
    },
});


export const TopBarLayoutFluentUI: FC<ITopBarUIProps> = ({appTitleContainer, subTitle}) => {
    const token = useAppSelector((state) => state.token);
    const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] = useBoolean(false);
    const tooltipId = useId('tooltip');

    const [ logout ] = useLogoutMutation();

    //redux action creator
    const dispatch = useAppDispatch();
    
    const handleLogOut = useCallback(
        async () => {
            hidePopup();
            await logout(token.sessionId!);
            localStorage.removeItem('token');
            dispatch(resetToken());
        },
        []
    );

    return (
        <Stack.Item>
            <Stack horizontal styles={RootStackStyles}>
                <Stack.Item>
                    <div className={classNames.titleStyles} style={{width: appTitleContainer.width}}>{appTitleContainer.nama}</div>  
                </Stack.Item>
                <Stack.Item grow>
                <div className={classNames.subTitleStyles}>{subTitle}</div>
                </Stack.Item>
                <Stack.Item align="center">
                        <IconButton iconProps={userIcon} aria-label="Emoji" className={classNames.white} onClick={showPopup}/>
                </Stack.Item>            
            </Stack>
            {isPopupVisible && 
            <Layer>
                <Popup
                    className={popupStyles.root}
                    role="dialog"
                    aria-modal="true"
                    onDismiss={hidePopup}
                    enableAriaHiddenSiblings={true}
                >
                    <Overlay onClick={hidePopup} />
                    <div role="document" className={popupStyles.content}>
                        <h2>Log out - {token.userName}</h2>
                        <p>
                            Silahkan Klik tombol keluar jika ingin mengakhiri pengaksesan aplikasi ini.
                        </p>
                        <PrimaryButton onClick={handleLogOut}>Keluar</PrimaryButton>
                    </div>
                </Popup>
            </Layer>
            }
        </Stack.Item>
    );
};