// Render with React
import {StrictMode} from "react";
import App from "./App";
import {createRoot} from "react-dom/client";
import React from "react";
import modules from "./projects.json";

const root = createRoot(document.getElementById("root")!);
root.render(
    <StrictMode>
        <App projects={modules}/>
    </StrictMode>
);