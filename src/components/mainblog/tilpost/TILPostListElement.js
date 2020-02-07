import React, { Component } from 'react';

export default class TILPostListElement extends Component {
  render() {
    const { data } = this.props;
    return (
      <div className="cl_PostListElement">
        <div className="cl_PostListElement_Title"> {data.title}</div>
        <div>{data.body}</div>
      </div>
    );
  }
}
