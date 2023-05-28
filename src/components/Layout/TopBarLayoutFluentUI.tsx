import { DefaultButton, FocusTrapZone, FontIcon, getTheme, IconButton, IIconProps, IStackItemStyles, IStackStyles, ITooltipHostStyles, Layer, mergeStyles, mergeStyleSets, Overlay, Popup, Stack, TooltipHost } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { resetCredential } from "../../features/security/authentication-slice";
import { resetToken } from "../../features/security/token-slice";


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
const userIcon: IIconProps = { iconName: 'Contact' };
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
    white: [{ color: 'white' }],
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
    const [isPopupVisible, { setTrue: showPopup, setFalse: hidePopup }] = useBoolean(false);
    const tooltipId = useId('tooltip');

    //redux action creator
    const dispatch = useAppDispatch();
    
    const handleLogOut = useCallback(
        () => {
            hidePopup();
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
                <Stack.Item align="center" >
                    <TooltipHost
                        content="Log out"
                        id={tooltipId}
                        calloutProps={calloutProps}
                        styles={hostStyles}
                        setAriaDescribedBy={false}
                    >
                        <IconButton iconProps={userIcon} aria-label="Emoji" className={classNames.white} onClick={showPopup}/>
                    </TooltipHost>
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
                        <h2>Log out</h2>
                        <p>
                            Silahkan Klik tombol keluar jika anda yakin untuk mengakhiri pengaksesan aplikasi sikoling.
                        </p>
                        <DefaultButton onClick={handleLogOut}>Keluar</DefaultButton>
                    </div>
                </Popup>
            </Layer>
            }
        </Stack.Item>
    );
};