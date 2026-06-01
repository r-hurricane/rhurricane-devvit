import '../index.css';

import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {AppLanding} from "./AppLanding";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppLanding />
    </StrictMode>
);