import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {AppDashboard} from "./AppDashboard";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppDashboard />
    </StrictMode>
);