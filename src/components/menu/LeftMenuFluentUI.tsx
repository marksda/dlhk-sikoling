import { INavLink, INavLinkGroup, INavStyles, Nav } from "@fluentui/react";
import { FC } from "react";

interface IHookFormLeftNavigationProps {
  selectedKey: string;
  ariaLabel: string;
  styles: Partial<INavStyles>;
  groups: INavLinkGroup[];
  onLinkClick: (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => void;
}

const navStyles: Partial<INavStyles> = {
  root: {
    height: 'calc(100vh - 68px)',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};

export const LeftMenuFluentUI: FC<IHookFormLeftNavigationProps> = (Props) => {
    return (
        <Nav {...Props}/>  
    );
}