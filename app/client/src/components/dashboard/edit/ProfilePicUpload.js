import React, {Component} from 'react';
import AvatarEditor from 'react-avatar-editor'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import defaultProfilePic from '../../../img/default_profile_pic.png';
import {
    ptUploadProfilePic
} from "../../../redux/actions/ptProfileActions";
import {
    clientUploadProfilePic
} from "../../../redux/actions/clientProfileActions";
import DisplayMessage from "../../common/Message/DisplayMessage";
import isEmpty from "../../../validation/is_empty";

class ProfilePicUpload extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            src: defaultProfilePic,
            width: 300,
            height: 300,
            border: 50,
            borderRadius: 60,
            color: [255,255,255, 0.2], // RGBA
            position: {
                x: 0.48,
                y: 0.5,
            },
            scale: 1.2,
            rotate: 0,
            fileName: "profile_pic",
            errors: {},
            message : {},
            loaded : null,
            //img: null
        };
    }

    componentDidMount(){
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
    }

    static getDerivedStateFromProps(props, state){
        if(!isEmpty(props.success)) {
            return {
                message: {
                    type: props.success.type,
                    msg: props.success.msg
                }
            }
        }
        if(!isEmpty(props.errors)){
            return {
                message: {
                    type : "ERROR",
                    msg: props.errors
                }
            }
        }
        if(!isEmpty(state.errors)){
            return {
                message: state.errors
            }
        }
        if(isEmpty(state.errors)){
            return {
                message: {}
            }
        }
        return null
    }

    setEditorRef = (editor) => this.editor = editor;

    onChange = e => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;

        this.setState({
            [name]: value,
            errors: {},
            message: {}
        });
    };

    myChange = e => {
        this.setState({
            position: e,
            errors: {},
            message: {}
        });
    };

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                this.setState({
                    src: reader.result
                });
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    onClickSave = () => {
        let {src} = this.state;
        // Reset error message
        this.setState({
            errors: {}
        });
        if(src !== defaultProfilePic){
            // Create file name out of date and user id
            const XAmzDate = new Date(Date.now()).toISOString().replace(/[ :,.-]/g, "").substring(0, 15).concat('Z');
            const {id} = this.props.authenticatedUser.user;
            let fileName = `${XAmzDate}-${id}`;
            this.makeCroppedImage()
                .then(blob => {
                    // Make sure file is under 2MB
                    if(blob.size < 2*Math.pow(10,6)){
                        if(this.props.authenticatedUser.user.pt){
                            this.props.ptUploadProfilePic(blob, fileName);
                        }
                        else{
                            this.props.clientUploadProfilePic(blob, fileName);
                        }
                    }
                    else{
                        this.setState({
                            errors: {
                                type: "ERROR",
                                msg: "File size is larger than 2MB."
                            }
                        });
                    }

                }).catch(() => {
                this.setState({
                    message: {
                        type: "ERROR",
                        msg: "Could not upload profile image."
                    }
                });
            });
        }
        else {
            this.setState({
                errors: {
                    type: "ERROR",
                    msg: "Please choose an image file to upload."
                }
            });
        }
    };

    static dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        let byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        let ab = new ArrayBuffer(byteString.length);
        // create a view into the buffer
        let ia = new Uint8Array(ab);
        // set the bytes of the buffer to the correct values
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    }

    async makeCroppedImage(){
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.getImage();
            const image = canvas.toDataURL('image/jpeg', 0.5);
            return await ProfilePicUpload.dataURItoBlob(image);
        }
    }

    render(){
        const {src, width, height, border, borderRadius, position, color, scale, message} = this.state;
        return (
            <div className="Profile_pic_upload">
                <div className="Profile_canvas" id="Profile_canvas">
                    <div className="profile-canvas">
                        <AvatarEditor
                            ref={this.setEditorRef}
                            image={src}
                            className="Viewing_canvas"
                            width={width}
                            height={height}
                            border={border}
                            position={position}
                            borderRadius={parseFloat(borderRadius)}
                            color={color} // RGBA
                            scale={parseFloat(scale)}
                            onPositionChange={this.myChange.bind(position)}
                        />
                    </div>
                    <div className="upload-zoom-profile-image">
                        <div className="zoom-slider">
                            <label className="Profile_label">
                                Zoom:
                            </label>
                            <input className="zoom"
                                   type="range"
                                   step="0.01"
                                   min="1"
                                   max="2"
                                   name="scale"
                                   onChange={this.onChange} value={this.state.scale}
                            />
                        </div>
                        <form method="post" action="#" id="upload-profile">
                            <div className="form-group files">
                                <label>Upload Your File: <span style={{color: "red"}}>(2 MB Limit)</span></label>
                                <input type="file" className="form-control" onChange={this.onSelectFile}/>
                            </div>
                        </form>
                        <DisplayMessage message={message}/>
                        <button type="button"
                                className="btn btn-info mb-4 upload-button"
                                onClick={this.onClickSave}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

ProfilePicUpload.propTypes = ({
    ptUploadProfilePic: PropTypes.func.isRequired,
    clientUploadProfilePic: PropTypes.func.isRequired,
});

const stateToProps = state => ({
    authenticatedUser: state.authenticatedUser,
    success: state.success,
    errors: state.errors
});

export default connect(stateToProps, {
    ptUploadProfilePic,
    clientUploadProfilePic
})(withRouter(ProfilePicUpload));
