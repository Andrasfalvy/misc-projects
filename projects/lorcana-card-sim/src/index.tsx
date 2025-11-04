// Render with React
import {StrictMode} from "react";
import App, {DefaultDeck, DefaultExtraCards} from "./App";
import {createRoot} from "react-dom/client";
import React from "react";
import LorcanaApi from "./api/LorcanaApi";
import Loader from "../../../common/Loader";

(async ()=>{
    let api = new LorcanaApi();
    (window as any)["api"] = api;

    const root = createRoot(document.getElementById("root")!);
    root.render(
        <StrictMode>
            <Loader text={"Loading Lorcana cards..."} promise={api.getApiCards()}>
                {()=>{
                    api.setExtraCards(DefaultExtraCards)
                    api.parseDeck(DefaultDeck);
                    return <App api={api}/>;
                }}
            </Loader>
        </StrictMode>
    );
})();