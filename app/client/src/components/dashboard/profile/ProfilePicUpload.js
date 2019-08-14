import React, {Component} from 'react';
import AvatarEditor from 'react-avatar-editor'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import defaultProfilePic from '../../../img/default_profile_pic.png';

class ProfilePicUpload extends Component {
    constructor(props){
        super(props);
        this.state = {
            src: defaultProfilePic,
            width: 300,
            height: 300,
            border: 50,
            borderRadius: 200,
            color: [255,255,255, 0.2], // RGBA
            scale: 1,
            rotate: 0,
            fileName: "profile_pic_test",
            croppedImage: null,
            otherCanvas: null,
            img: null
        };

        this.onChange = this.onChange.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
        this.onSample = this.onSample.bind(this);
    }

    setEditorRef = (editor) => this.editor = editor;

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

    onClickSave(){
        this.makeCroppedImage();
    }

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

        // write the ArrayBuffer to a blob, and you're done
        return new Blob([ab], {type: mimeString});

    }

    async makeCroppedImage(){
        if (this.editor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.editor.getImage();
            this.setState({otherCanvas: canvas});
            console.log(canvas.toDataURL());
            // canvas.toBlob(function(blob){
            //     const url = URL.createObjectURL(blob);
            //     console.log(url)
            //     URL.revokeObjectURL(url);
            // })

            const blob = ProfilePicUpload.dataURItoBlob(canvas.toDataURL());

            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            // const canvasScaled = this.editor.getImageScaledToCanvas()

            // const croppedImage = await this.getCroppedImage(canvas, this.state.fileName);

            //console.log(croppedImage)

            this.setState({croppedImage: blob})
        }
    }

    getCroppedImage(canvas, fileName){
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    console.error("Canvas is empty");
                    return;
                }
                blob.name = fileName;
                URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, "image/jpeg");
        });
    }

    onSample(){
        if(this.state.croppedImage !== null){
        // if(this.state.otherCanvas !== null){
            let canvas = document.getElementById("croppedImageCanvas");
            canvas.width = this.state.width;
            canvas.height = this.state.height;
            let imageUrl = URL.createObjectURL(this.state.croppedImage);
            this.setState({img: imageUrl})
            // URL.revokeObjectURL(this.state.croppedImage)
            // console.log(this.state.croppedImage)
            // canvas.parentNode.replaceChild(this.state.otherCanvas, canvas);
        }
    }

    render(){
        const {src} = this.state;

        return (
            <div className="Profile_pic_upload">
                <div className="Profile_canvas" id="Profile_canvas">
                    <AvatarEditor
                        ref={this.setEditorRef}
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
                    <div>
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
                    <button type="button" onClick={this.onClickSave}>Upload</button>
                    <button type="button" onClick={this.onSample}>Sample</button>
                </div>
                <canvas id="croppedImageCanvas"></canvas>
                {this.state.img !== null ? <img className="rounded-circle" src={this.state.img}/> : null}
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
