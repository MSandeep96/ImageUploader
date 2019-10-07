import React, { Component } from 'react'
import ConfirmPic from './ConfirmPic'
import Cropper from './Cropper';

export default class Content extends Component {

  state = {
    cropMode: false
  }

  toCropMode = ()=> {
    this.setState({cropMode: true});
  }

  render() {
    if(!this.state.cropMode) return <ConfirmPic goBack={this.props.goBack} filePath={this.props.filePath} toCropMode={this.toCropMode}/>
    return (
      <Cropper filePath={this.props.filePath} cropComplete={this.props.cropComplete}/>
    );
  }
}
