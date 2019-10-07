import React, { Component } from 'react'
import ReactCrop from 'react-image-crop';
import { Button } from '@blueprintjs/core';
import "react-image-crop/dist/ReactCrop.css";
import './Cropper.css';

export default class Cropper extends Component {

  modes = {
    horizontal: { height: 755, width: 450 },
    vertical: { height: 365, width: 450 },
    horizontalSmall: { height: 365, width: 212 },
    gallery: { height: 380, width: 380 }
  }

  types = ['horizontal', 'vertical', 'horizontalSmall', 'gallery']

  state = {
    onType: 0,
    crop: { unit: 'px' },
    picked: {}
  }

  componentDidMount() {
    this.updateCrop();
  }

  updateCrop = () => {
    let { crop } = this.state;
    crop.height = this.modes[this.types[this.state.onType]].height;
    crop.width = this.modes[this.types[this.state.onType]].width;
    this.setState({ crop }, this.cropComplete.bind(this, this.state.crop));
  }

  cropClicked = () => {
    this.setState((prevState)=>{
    let { picked, onType } = prevState;
    picked[this.types[onType]] = { x: prevState.crop.x, y: prevState.crop.y };
    if (onType === 3) {
      this.props.cropComplete(picked);
      return prevState;
    }
    return { picked, onType: onType + 1 };
    }, this.updateCrop);
  }

  backClicked = () => {
    this.setState((prevState)=>{
      return {onType: prevState.onType - 1}
    }, this.updateCrop);
  }

  cropComplete = crop => {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(this.imageRef, crop, 'ok.jpeg').then(croppedImageUrl => this.setState({ croppedImageUrl }));
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  render() {
    return (
      <div className='cropperDiv'>
        <ReactCrop src={this.props.filePath} onChange={crop => this.setState({ crop })}
          onComplete={this.cropComplete} onImageLoaded={image => this.imageRef = image}
          crop={this.state.crop} locked={true} />
        <div className='previewDiv'>
          {this.state.croppedImageUrl &&
            <div className='cropImg'>
              <img src={this.state.croppedImageUrl} />
            </div>}
          <Button text='Crop' onClick={this.cropClicked} />
          <Button text='Back' onClick={this.backClicked} />
        </div>
      </div>
    )
  }
}
