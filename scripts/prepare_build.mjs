import * as fs from "node:fs";

let projectFolders = fs.readdirSync("./projects", {withFileTypes: true}).filter(e=>e.isDirectory());
let projects = projectFolders.map(dir=>{
    let packageJson = JSON.parse(fs.readFileSync("./projects/" + dir.name + "/package.json", "utf-8"));
    return {
        id: dir.name,
        name: packageJson.displayName,
        shortDescription: packageJson.description,
        image: "./" + dir.name + "/thumbnail.png"
    };
});

fs.writeFileSync("./index/src/projects.json", JSON.stringify(projects, null, 4));