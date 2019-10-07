import React, { Component } from 'react';
import { FileInput, Card, Elevation } from '@blueprintjs/core';
import './PickImage.css';

export default class PickImage extends Component {

  inputChanged = (e) => {
    let pickedImage = e.currentTarget.files;
    if (pickedImage && pickedImage[0]) {
      let reader = new FileReader();
      reader.onload = (e) => this.props.onSelect(pickedImage[0], e.target.result);
      reader.readAsDataURL(pickedImage[0]);
    }
  }

  checkImage = (url) => {
    if (url.length === 0)
      return false;
    return true;
  }

  render() {
    return (
      <Card className='pickImage' elevation={Elevation.TWO}>
        <h3>Pick an image of dimensions 1024 x 1024 : </h3>
        <div className='pickFileInput'>
          <FileInput text="Choose image..." onInputChange={this.inputChanged} />
        </div>
      </Card>
    )
  }
}
