import React, { Component } from 'react'
import './UploadedImages.css';

export default class UploadedImages extends Component {
  render() {
    return (
      <div className='imageGrid'>
        {this.props.data.map((e) => {
          return (
            <a href={e} target='_blank'>
              <img src={e} alt='' />
            </a>);
        })}
      </div>
    )
  }
}
