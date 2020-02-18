// * Library
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import debounce from 'lodash.debounce';
// * File
import CodeBlock from './CodeBlock';
import TabBlog from '../../pages/TabBlog';
import { currentPage } from '../../redux/action';
import { getRandomInt, colorArray } from '../../TagColor';
import { PostEditPost, getSelectPost, getTags } from '../../redux/api';

// * CSS
import {
  Tag,
  Input,
  Button,
  Avatar,
  AutoComplete,
  List,
  message,
  Modal,
} from 'antd';

class DevPostEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      post: {},
      title: JSON.parse(localStorage.getItem('currentPost')).title,
      concept: JSON.parse(localStorage.getItem('currentPost')).content,
      Strategy: JSON.parse(localStorage.getItem('currentPost')).content,
      handling: JSON.parse(localStorage.getItem('currentPost')).content,
      Referenece: JSON.parse(localStorage.getItem('currentPost')).content,
      Lesson: JSON.parse(localStorage.getItem('currentPost')).content,
      selected_tag: JSON.parse(localStorage.getItem('currentPost')).tags,
      dataSource: [],
      isEdit: false,
      visible: false,
    };
    this.debouncedHandleChange = debounce(this.debouncedHandleChange, 1000);
  }

  componentDidMount() {
    this.props.handlePage('Edit'); // 현재 페이지 값 업데이트
    let id = this.props.PostState.currentPost.id;
    if (id) {
      localStorage.setItem('post_id', JSON.stringify({ id: id }));
    } else {
      id = JSON.parse(localStorage.getItem('post_id')).id;
    }
    // 아이디 값으로 서버에 정보 요청 후 포스트 스테이트로 업데이트
    getSelectPost(id).then((res) => {
      this.setState({
        post: Object.assign(this.state.post, res.data),
      });
    });
    // 태그 값 서버에 요청 후 스테이트 값으로 업데이트
    getTags().then((res) => this.setState({ dataSource: res.data.tags }));
    // 세이브 데이터 모달 뷰 관리
    if (JSON.parse(localStorage.getItem('PostSave'))) {
      this.setState({ visible: true });
    }
  }

  // ? tag controll
  onSelect = (value) => {
    if (this.state.selected_tag.includes(value)) {
      message.warning(`${value} is already added`);
    } else {
      this.setState({
        selected_tag: this.state.selected_tag.concat([value]),
      });
    }
  };

  onChange = (value) => {
    this.setState({ value });
  };

  onClose = (item) => {
    this.setState({
      selected_tag: this.state.selected_tag.filter((tag) => tag !== item),
    });
  };
  // ? 모달 뷰 관리
  handleOk = (e) => {
    let saveData = JSON.parse(localStorage.getItem('PostSave'));
    this.setState({
      visible: false,
      post: Object.assign(this.state.post, saveData),
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  // ? 텍스트 수정 관리
  // 디바운스 사용 reference: https://hyunseob.github.io/2018/06/24/debounce-react-synthetic-event/
  handleChange = (state) => (event) => {
    this.setState({
      [state]: event.target.value,
    });
    this.debouncedHandleChange();
  };
  debouncedHandleChange = () => {
    const {
      title,
      concept,
      Strategy,
      handling,
      Referenece,
      Lesson,
    } = this.state;

    let content = concept + Strategy + handling + Referenece + Lesson;
    // 로컬 스토리지에 저장 데이터 저장
    localStorage.setItem(
      'PostSave',
      JSON.stringify({ title: title, content: content }),
    );
  };

  // ? publish
  handlePublishBtn = () => {
    localStorage.removeItem('currentPost');
    localStorage.removeItem('PostSave');
    this.handlePublish();
  };
  // 서버에 업데이트 요청 메소드
  handlePublish = async () => {
    const {
      title,
      concept,
      Strategy,
      handling,
      Referenece,
      Lesson,
      selected_tag,
    } = this.state;

    let localData_id = JSON.parse(localStorage.getItem('post_id')).id;
    let content = concept + Strategy + handling + Referenece + Lesson;
    console.log('request body:', localData_id, title, content, selected_tag);
    await PostEditPost(localData_id, title, content, selected_tag);
    this.setState({ isEdit: true });
  };
  // ! Render
  render() {
    const {
      value,
      concept,
      Strategy,
      handling,
      Referenece,
      Lesson,
      post,
      dataSource,
      selected_tag,
      isEdit,
    } = this.state;

    let PropTitle, userName, tagView;
    console.log('post:', post);

    if (selected_tag === undefined || !selected_tag.length) {
      tagView = 'none';
    }
    if (isEdit) {
      return <Redirect to="/Devpost">Publish</Redirect>;
    }
    if (!Object.keys(post).length) {
      return <></>;
    } else {
      PropTitle = post.title;
      userName = post.users.username;
    }

    return (
      <div>
        <TabBlog></TabBlog>
        <Modal
          title="Save data"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          Are you sure you want to get the saved data?
        </Modal>
        <div className="cl_Post">
          <Input
            className="cl_Edit_Title cl_Post_set "
            type="text"
            onChange={this.handleChange('title')}
            defaultValue={PropTitle}
          />

          <div className="cl_Post_author_Info cl_Post_set ">
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
            <div className="cl_Post_author">{userName}</div>
          </div>

          <div className="cl_Post_Contents ">
            <div className="cl_Post_Edit_Subtitle ">Project concept</div>
            <div className="cl_Plain_Edit_Content ">
              <TextareaAutosize
                className="cl_Plain_Edit_Text cl_Plain_Edit_Set"
                onChange={this.handleChange('concept')}
                defaultValue={concept}
              />
              <div className="cl_Plain_Edit_Markdown cl_Plain_Edit_Set">
                <ReactMarkdown
                  source={concept}
                  renderers={{
                    code: CodeBlock,
                  }}
                />
              </div>
            </div>

            <div className="cl_Post_Edit_Subtitle "> Coding Strategy</div>
            <div className="cl_Plain_Edit_Content ">
              <TextareaAutosize
                className="cl_Plain_Edit_Text cl_Plain_Edit_Set"
                onChange={this.handleChange('Strategy')}
                defaultValue={Strategy}
              />
              <div className="cl_Plain_Edit_Markdown cl_Plain_Edit_Set">
                <ReactMarkdown
                  source={Strategy}
                  renderers={{
                    code: CodeBlock,
                  }}
                />
              </div>
            </div>
            <div className="cl_Post_Edit_Subtitle "> Error handling</div>
            <div className="cl_Plain_Edit_Content ">
              <TextareaAutosize
                className="cl_Plain_Edit_Text cl_Plain_Edit_Set"
                onChange={this.handleChange('handling')}
                defaultValue={handling}
              />
              <div className="cl_Plain_Edit_Markdown cl_Plain_Edit_Set">
                <ReactMarkdown
                  source={handling}
                  renderers={{
                    code: CodeBlock,
                  }}
                />
              </div>
            </div>

            <div className="cl_Post_Edit_Subtitle "> Referenece</div>
            <div className="cl_Plain_Edit_Content ">
              <TextareaAutosize
                className="cl_Plain_Edit_Text cl_Plain_Edit_Set"
                onChange={this.handleChange('Referenece')}
                defaultValue={Referenece}
              />
              <div className="cl_Plain_Edit_Markdown cl_Plain_Edit_Set">
                <ReactMarkdown
                  source={Referenece}
                  renderers={{
                    code: CodeBlock,
                  }}
                />
              </div>
            </div>
            <div className="cl_Post_Edit_Subtitle "> Lesson</div>
            <div className="cl_Plain_Edit_Content ">
              <TextareaAutosize
                className="cl_Plain_Edit_Text cl_Plain_Edit_Set"
                onChange={this.handleChange('Lesson')}
                defaultValue={Lesson}
              />
              <div className="cl_Plain_Edit_Markdown cl_Plain_Edit_Set">
                <ReactMarkdown
                  source={Lesson}
                  renderers={{
                    code: CodeBlock,
                  }}
                />
              </div>
            </div>
          </div>
          <AutoComplete
            className="cl_Post_Tags cl_Post_set"
            value={value}
            onSelect={this.onSelect}
            onChange={this.onChange}
            style={{ width: 200 }}
            dataSource={dataSource}
            placeholder="Find a tag"
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
          />
          <div>
            <List
              style={{ display: tagView }}
              dataSource={this.state.selected_tag}
              renderItem={(item) => (
                <span>
                  <Tag
                    closable
                    color={colorArray[getRandomInt(0, 10)]}
                    onClose={() => this.onClose(item)}
                  >
                    {item}
                  </Tag>
                </span>
              )}
            />
          </div>

          <Button
            type="primary"
            className="cl_Edit_Publish_Btn"
            onClick={this.handlePublishBtn}
          >
            Publish
          </Button>
          <div className="cl_post_Margin"></div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    PostState: state.PostState,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handlePage: (page) => {
      dispatch(currentPage(page));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DevPostEdit);
