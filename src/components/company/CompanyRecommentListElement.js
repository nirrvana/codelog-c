// * Library
import React, { Component } from 'react';
// * CSS
// eslint-disable-next-line no-unused-vars
import { Tag } from 'antd';

export default class CompanyRecommentListElement extends Component {
  render() {
    const { recommended_developer } = this.props;

    return (
      <div className="cl_Company_Recommend_Element">
        <div className="cl_recommended_developer_Usename cl_recommended_developer_Set">
          {recommended_developer.username}
        </div>
        <div className="cl_recommended_developer_Email cl_recommended_developer_Set">
          {recommended_developer.email}
        </div>
        <div className="cl_recommended_developer_Homepage cl_recommended_developer_Set">
          {recommended_developer.personal_homepage}
        </div>
        {/* <div className="cl_recommended_developer_Tags ">
          {data.email.tags.map((el, i) => {
            return (
              <Tag color="#108ee9" key={'recommended_developer_tags' + i}>
                {el}
              </Tag>
            );
          })}
        </div> */}
      </div>
    );
  }
}
