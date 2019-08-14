import React, {Component} from 'react';
import AvatarEditor from 'react-avatar-editor'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import defaultProfilePic from '../../../img/default_profile_pic.png';

class ProfilePicUpload extends Component {
    constructor(props){
        super(props)
        this.state = {
            src: defaultProfilePic,
            width: 300,
            height: 300,
            border: 50,
            borderRadius: 200,
            color: [255,255,255, 0.2], // RGBA
            scale: 1,
            rotate: 0,
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;

        this.setState({[name]: value});
    }

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // onClickSave = () => {
    //     if (this.editor) {
    //         // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
    //         // drawn on another canvas, or added to the DOM.
    //         const canvas = this.editor.getImage()
    //
    //         // If you want the image resized to the canvas size (also a HTMLCanvasElement)
    //         const canvasScaled = this.editor.getImageScaledToCanvas()
    //     }
    // }

    setEditorRef = (editor) => this.editor = editor;

    render(){
        const {src} = this.state;

        return (
            <div className="Profile_pic_upload">
                <div className="Profile_canvas">
                    <AvatarEditor
                        image={src}
                        className="Viewing_canvas"
                        width={this.state.width}
                        height={this.state.height}
                        border={this.state.border}
                        borderRadius={parseFloat(this.state.borderRadius)}
                        color={this.state.color} // RGBA
                        scale={parseFloat(this.state.scale)}
                        rotate={this.state.rotate}
                    />
                    <input type="file" name="newImage" onChange={this.onSelectFile}/>
                    <label className="zoom_label">
                        Zoom:
                    </label>
                    <input className="zoom"
                           type="range"
                           step="0.01"
                           min="1"
                           max="2"
                           name="scale"
                           onChange={this.onChange} value={this.state.scale}/>
                </div>
            </div>
            // <div className="Profile_pic_upload">
            //     <div className="Profile_canvas">
            //
            //     </div>
            //     {/*<div className="file_upload_button">*/}
            //         {/*<input type="file" value="Browse..." className="btn btn-file btn-info mt-1" onChange={this.onSelectFile} />*/}
            //     {/*</div>*/}
            // </div>
        );
    }
}

export default connect()(withRouter(ProfilePicUpload));
