import ProjectData from "./ProjectData";
import React, {Component} from "react";
import Spinner from "../../common/Spinner";
import "./ProjectCard.scss";

export default class ProjectCard extends Component<ProjectCardProps, ProjectCardState> {

    constructor(props: ProjectCardProps) {
        super(props);

        this.state = {
            loaded: false
        }
    }

    render() {
        return <a href={"/" + this.props.project.id} className="project-card">
            <div className="_content">
                <div className={"_image" + (this.state.loaded ? " _loaded" : "")}>
                    <img src={this.props.project.image} onLoad={()=>this.setState({loaded: true})} alt={this.props.project.name}/>
                    <Spinner/>
                </div>
                <div className="_text">
                    <h2>{this.props.project.name}</h2>
                    <p>{this.props.project.shortDescription}</p>
                </div>
            </div>
        </a>;
    }
}
interface ProjectCardProps {
    project: ProjectData
}
interface ProjectCardState {
    loaded: boolean;
}