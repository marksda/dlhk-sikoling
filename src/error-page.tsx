import { DefaultEffects } from "@fluentui/react";
import { FC } from "react";
import { useRouteError } from "react-router-dom";

const containerStyles: React.CSSProperties = {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    // height: '100vh'        
};
const panelStyle = {
    marginTop: 64,
    boxShadow: DefaultEffects.elevation4,
    borderTop: '2px solid red', 
    borderRadius: 3, 
    padding: '16px 32px',
    minWidth:400,
    maxWidth: 400,
    minHeight: 100,
    background: 'white',
}

export const ErrorPage: FC = () => {
  const error: any = useRouteError();
  
  return (
    <div style={containerStyles}>
        <div id="error-page" style={panelStyle}>
            <h1 style={{marginTop: 0}}>Ooops!</h1>
            <p>Maaf, halaman yang anda minta tidak tersedia.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    </div>
    
  );
}