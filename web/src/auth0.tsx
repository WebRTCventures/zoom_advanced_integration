import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

export const Auth0ProviderWithConfig: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const domain = "dev-kwv6eaoa478afrfo.us.auth0.com";
  const clientId = "YOUR_CLIENT_ID";
  const redirectUri = window.location.origin + "/callback";
  const audience = "https://zoom-okta-meeting-api";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: audience,
      }}
    >
      {children}
    </Auth0Provider>
  );
};
