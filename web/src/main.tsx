import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0ProviderWithConfig } from "./auth0";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Auth0ProviderWithConfig>
    <App />
  </Auth0ProviderWithConfig>
);
