import React, { Component } from 'react'
import { Card, Button, Icon } from '@blueprintjs/core'
import './ConfirmPic.css'
import { sl } from '../../utils/StringLiterals';

export default class ConfirmPic extends Component {

  state = {};

  loadedPic = ({ target: img }) => {
    if (img.naturalWidth === 1024 && img.naturalHeight === 1024) {
      this.setState({ validImage: true });
    } else {
      this.setState({ error: sl.invalidImg });
    }
  }

  render() {
    return (
      <Card className='pic_container'>
        <div className='backBtn'>
          <Button className='bp3-minimal' icon={<Icon icon='arrow-left' iconSize={Icon.SIZE_LARGE} />} onClick={this.props.goBack} />
        </div>

        <img className='lepic' onLoad={this.loadedPic} src={this.props.filePath} alt='' />

        <div className='confirmErrorMsg'>
          {this.state.validImage &&
            <Button text='Crop' onClick={this.props.toCropMode} className='bp3-fill bp3-intent-primary' />}
          {this.state.error &&
            <h4>{this.state.error}</h4>}
        </div>

      </Card>
    )
  }
}
