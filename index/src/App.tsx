import {Component} from "react";
import ProjectData from "./ProjectData";
import React from "react";
import ProjectCard from "./ProjectCard";
import "./App.scss";

export default class App extends Component<AppProps> {

    constructor(props: AppProps) {
        super(props);
    }

    render() {
        return <div className="app">
            <div className="_header">
                <h1>Fun/Misc Projects</h1>
                <p>These are random somewhat smaller web-based projects that I've worked on, and needed to host for some reason.</p>
            </div>
            <div className="_projects">
                {this.props.projects.map(project => {
                    return <ProjectCard project={project} key={project.id}/>;
                })}
            </div>
        </div>
    }
}

interface AppProps {
    projects: ProjectData[]
}
