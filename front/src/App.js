import React, { Component } from 'react'
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import PickImage from './components/PickImage';
import { Card, Elevation, Spinner } from "@blueprintjs/core";
import './App.css';
import ImagePicked from './components/ImagePicked/ImagePicked';
import uploadPic from './actions/uploadPic';
import UploadedImages from './components/UploadedImages';

export default class App extends Component {

  state = {
    fileSelected: false,
    loading: false
  }

  getContent = () => {
    if(this.state.loading){
      return <Spinner size={Spinner.SIZE_LARGE}/>
    }
    if(this.state.uploadComplete){
      return <UploadedImages data={this.state.filesUploaded}/>
    }
    if (!this.state.fileSelected) {
      return <PickImage onSelect={this.onSelect} />;
    }
    if(!this.state.cropComplete){
      return <ImagePicked goBack={this.goBack} filePath={this.state.filePath} cropComplete={this.cropComplete}/>
    }

  }

  goBack = () => {
    this.setState({fileSelected: false});
  }

  onSelect = (data, filePath) => {
    this.setState({
      fileSelected: true,
      filePath,
      data
    });
  }

  cropComplete = (imgDims)=> {
    this.setState({cropComplete: true, loading: true});
    uploadPic(this.state.data, imgDims)
    .then((data)=>{
      this.setState({
        filesUploaded : data,
        loading:false, 
        uploadComplete: true, 
        cropComplete: false, 
        fileSelected: false
      });
    })
    .catch(()=>{
      //show error dialog
    })
  }

  render() {
    return (
      <div className="App">
        <Card className="header" elevation={Elevation.FOUR}>
          Image Cropper
        </Card>
        <div className="content">
          {this.getContent()}
        </div>
      </div>
    )
  }
}
