import * as readline from "node:readline";

(async ()=>{
    let ws = new WebSocket("ws://localhost:4000/ws");
    ws.onmessage = e=>console.log(e.data);

    ws.onerror = e=>{
        console.error(e);
        process.exit(1);
    };
    ws.onclose = ()=>{
        console.log("connection closed");
        process.exit(0);
    };

    console.log("connecting...");
    await new Promise(r=>ws.onopen = r);
    console.log("connected");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> ",
    });

    rl.prompt();

    rl.on("line", (line) => {
        line = line.trim();
        if (!line) {
            console.log("empty line");
            return rl.prompt();
        }
        try {
            JSON.parse(line);
        } catch (e) {
            console.error(e);
            return rl.prompt();
        }

        console.log("sending:", line);

        ws.send(line);

        rl.prompt();
    });
})();