import Lobby from "./Lobby";
import WSClient from "../../../common/WSClient";

export default class MaganFoglaloClient {
    private lobby: Lobby | null;
    private wsClient: WSClient | null;

    constructor() {
        this.lobby = null;
        this.wsClient = null;
    }

    getLobby() {
        return this.lobby;
    }

    async connect(url: string) {
        if (this.wsClient) {
            this.wsClient.disconnect();
        }
        let ws = new WebSocket(url);
        this.wsClient = new WSClient(ws, ()=>{
            // TODO send handshake
        });
    }
}