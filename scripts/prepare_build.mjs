import * as fs from "node:fs";
import path from "path";

let rootFolder = path.resolve("./");
let baseFolder = path.resolve("./projects");
let projectFolders = fs.readdirSync(baseFolder, {withFileTypes: true, recursive: true}).filter(e=>e.isDirectory());
let projects = projectFolders.map(dir=>{
    let fullPath = path.resolve(dir.parentPath, dir.name);
    let relativePath = "." + path.sep + path.relative(rootFolder, fullPath);

    let jsonPath = relativePath + path.sep + "package.json";
    if (!fs.existsSync(jsonPath)) return null;
    let packageJson = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    if (packageJson.frontend === false) return null;
    console.log(`Found frontend project '${packageJson.name}' at ${relativePath}`);
    return {
        id: packageJson.name,
        name: packageJson.displayName,
        shortDescription: packageJson.description,
        image: "./" + packageJson.name + "/thumbnail.png"
    };
}).filter(e => e != null);

fs.writeFileSync("./index/static/projects_prod.json", JSON.stringify(projects, null, 4));