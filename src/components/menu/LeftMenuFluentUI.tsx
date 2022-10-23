import { INavLink, INavLinkGroup, INavStyles, Nav } from "@fluentui/react";
import { FC, useCallback, useState } from "react";

interface IHookFormLeftNavigationProps {
  menus: INavLinkGroup[];
  setIdContentPage: (idPage: string) => void;
}

const navStyles: Partial<INavStyles> = {
  root: {
    height: 'calc(100vh - 68px)',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};

export const LeftMenuFluentUI: FC<IHookFormLeftNavigationProps> = ({menus,setIdContentPage}) => {
    const [selectedKeyItemMenu, setSelectedKeyItemMenu] = useState<string>(menus![0].links![0].key!);

    const onItemMenuSelected = useCallback(
      (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
          if(item) {
              setSelectedKeyItemMenu(item.key!);
              setIdContentPage(item.key!);
          }
      },
      []
    );

    return (
        <Nav 
          onLinkClick={onItemMenuSelected}
          selectedKey={selectedKeyItemMenu}
          ariaLabel="left menu pemrakarsa"
          styles={navStyles}
          groups={menus}
        />  
    );
}