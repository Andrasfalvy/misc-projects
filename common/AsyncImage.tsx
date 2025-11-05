import React, {Component} from "react";
import Spinner from "./Spinner";
import "./AsyncImage.scss";

export default class AsyncImage extends Component<AsyncImageProps, AsyncImageState> {

    constructor(props: AsyncImageProps) {
        super(props);

        this.state = {};
    }

    render() {
        if (this.state.resolvedSrc) {
            return <div className="async-image _loaded">
                <img {...this.props} src={this.state.resolvedSrc} alt={this.props.alt}/>
                <Spinner/>
            </div>
        }
        return <div className="async-image">
            <Spinner/>;
        </div>
    }
    componentDidMount() {
        this.props.src.then(src=>{
            if (this.state.resolvedSrc !== src) {
                this.setState({resolvedSrc: src});
            }
        });
    }
    componentDidUpdate(prevProps: Readonly<AsyncImageProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (prevProps.src !== this.props.src) {
            this.props.src.then(src=>{
                if (this.state.resolvedSrc !== src) {
                    this.setState({resolvedSrc: src});
                }
            });
        }
    }
}
interface AsyncImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
    src: Promise<string>;
}
interface AsyncImageState {
    resolvedSrc?: string;
}