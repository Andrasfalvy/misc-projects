// Render with React
import {StrictMode} from "react";
import App from "./App";
import {createRoot} from "react-dom/client";
import React from "react";

(async ()=>{
    let modules;
    try {
        modules = await fetch("./projects_prod.json").then(r=>r.json());
    } catch {
        try {
            modules = await fetch("./projects_dev.json").then(r=>r.json());
        } catch (e) {
            console.error("Failed to load projects:", e);

            let h1 = document.createElement("h1");
            h1.innerText = "Error loading projects!";
            document.body.appendChild(h1);
            return;
        }
    }
    const root = createRoot(document.getElementById("root")!);
    root.render(
        <StrictMode>
            <App projects={modules}/>
        </StrictMode>
    );
})();