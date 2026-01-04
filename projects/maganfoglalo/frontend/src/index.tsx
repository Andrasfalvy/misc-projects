import {createRoot} from "react-dom/client";
import React, {StrictMode} from "react";
import App from "./ui/App";
import MaganFoglaloClient from "./api/MaganFoglaloClient";

let api = new MaganFoglaloClient();
(window as any)["api"] = api;

const root = createRoot(document.getElementById("root")!);
root.render(
    <StrictMode>
        <App api={api}/>
    </StrictMode>
);