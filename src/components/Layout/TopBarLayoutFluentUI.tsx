import { DefaultButton, FocusTrapZone, FontIcon, getTheme, IconButton, IIconProps, IStackItemStyles, IStackStyles, ITooltipHostStyles, Layer, mergeStyles, mergeStyleSets, Overlay, Popup, Stack, TooltipHost } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { resetToken } from "../../features/security/token-slice";

const theme = getTheme();
const RootStackStyles: IStackStyles = {
    root: {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        lineHeight: '50px',
        padding: '0 20px',
    },
};
const labelTopBarStyles: IStackItemStyles = {
    root: {
      fontSize: '1.2em',
      fontWeight: 500
    },
};
const calloutProps = { gapSpace: 0 };
const userIcon: IIconProps = { iconName: 'Contact' };
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
const classNames = mergeStyleSets({
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


export const TopBarLayoutFluentUI: FC = () => {
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
        <>
        <Stack horizontal styles={RootStackStyles}>
            <Stack.Item grow align="center" styles={labelTopBarStyles}>
                Sikoling  
            </Stack.Item>
            <Stack.Item align="center" >
                <TooltipHost
                    content="Login Account"
                    id={tooltipId}
                    calloutProps={calloutProps}
                    styles={hostStyles}
                    setAriaDescribedBy={false}
                >
                    <IconButton iconProps={userIcon} aria-label="Emoji" className={classNames.white} onClick={showPopup}/>
                </TooltipHost>
            </Stack.Item>            
        </Stack>
        {isPopupVisible && (
            <Layer>
              <Popup
                className={popupStyles.root}
                role="dialog"
                aria-modal="true"
                onDismiss={hidePopup}
                enableAriaHiddenSiblings={true}
              >
                <Overlay onClick={hidePopup} />
                <FocusTrapZone>
                  <div role="document" className={popupStyles.content}>
                    <h2>Example Popup</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                      dolore magna aliqua.
                    </p>
                    <DefaultButton onClick={handleLogOut}>Log out</DefaultButton>
                  </div>
                </FocusTrapZone>
              </Popup>
            </Layer>
          )}
          </>
    );
};