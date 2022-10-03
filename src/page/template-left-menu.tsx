import { INavLink, INavLinkGroup, INavStyles, Nav } from "@fluentui/react";
import { FC } from "react";

interface IHookFormLeftNavigationProps {
  selectedKey: string;
  ariaLabel: string;
  styles: Partial<INavStyles>;
  groups: INavLinkGroup[];
  onLinkClick: (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => void;
}

export const LeftMenuPage: FC<IHookFormLeftNavigationProps> = (props) => {
    return (
        <Nav {...props}/>  
    );
}