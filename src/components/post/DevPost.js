// * Library
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSelectPost } from '../../redux/api';
import { currentPost, currentPage } from '../../redux/action';
import TabBlog from '../../pages/TabBlog';
import { getRandomInt, colorArray } from '../../TagColor';
import ReactMarkdown from 'react-markdown';
// * CSS
import {
  Comment,
  Tooltip,
  Tag,
  List,
  Input,
  Button,
  Icon,
  Popover,
  Avatar,
} from 'antd';
import moment from 'moment';
import CodeBlock from '../postedit/CodeBlock';
const { TextArea } = Input;

const data = [
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently.
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(1, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    ),
  },
  {
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high
        quality design resources (Sketch and Axure), to help people create their
        product prototypes beautifully and efficiently.
      </p>
    ),
    datetime: (
      <Tooltip
        title={moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(2, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    ),
  },
];

class DevPost extends Component {
  state = {
    post: {},
    isLike: false,
  };

  componentDidMount() {
    this.props.handlePage('Post');
    let id = this.props.PostState.currentPost.id;
    if (id) {
      localStorage.setItem('post_id', JSON.stringify({ id: id }));
    } else {
      id = JSON.parse(localStorage.getItem('post_id')).id;
    }

    getSelectPost(id).then((res) => {
      this.setState({ post: Object.assign(this.state.post, res.data) });
    });
  }
  handlePostData = (title, content) => () => {
    let currentPost = {
      title,
      content,
    };
    localStorage.setItem('currentPost', JSON.stringify(currentPost));
  };
  handleIsLikeState = () => {
    let likesCount = this.state.post.likes;

    if (!this.state.isLike) {
      this.setState({
        isLike: true,
        post: { ...this.state.post, likes: likesCount + 1 },
      });
    } else {
      this.setState({
        isLike: false,
        post: { ...this.state.post, likes: likesCount - 1 },
      });
    }
  };
  render() {
    const { isLike, post } = this.state;
    let color, title, content, Likes;
    if (isLike) {
      color = 'red';
    }
    if (!Object.keys(post).length) {
      title = '';
      content = '';
      Likes = 0;
    } else {
      title = post.title;
      content = post.content;
      Likes = post.likes;
    }
    return (
      <div>
        <TabBlog></TabBlog>

        <div className="cl_Post">
          <div className="cl_Post_Title cl_Post_set ">{title}</div>
          <div className="cl_Post_author_Info cl_Post_set ">
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
            <div className="cl_Post_author">Root</div>

            <Tooltip
              className="cl_Post_Time"
              title={moment().format('YYYY-MM-DD HH:mm:ss')}
            >
              <div>{moment(this.state.post.updatedAt).fromNow()}</div>
            </Tooltip>

            <Link
              to="/DevpostEdit"
              className="cl_Post_Edit_Btn"
              onClick={this.handlePostData(title, content)}
            >
              Edit
            </Link>
          </div>

          <div className="cl_Post_Contents cl_PlainPost_Contents ">
            <div className="cl_Post_Content">
              Project concept
              <ReactMarkdown
                className="cl_Post_Contents"
                source={content}
                renderers={{
                  code: CodeBlock,
                }}
              />
            </div>
            <div className="cl_Post_Content">
              Coding Strategy
              <ReactMarkdown
                className="cl_Post_Contents"
                source={content}
                renderers={{
                  code: CodeBlock,
                }}
              />
            </div>
            <div className="cl_Post_Content">
              Error handling
              <ReactMarkdown
                className="cl_Post_Contents"
                source={content}
                renderers={{
                  code: CodeBlock,
                }}
              />
            </div>
            <div className="cl_Post_Content">
              Referenece
              <ReactMarkdown
                className="cl_Post_Contents"
                source={content}
                renderers={{
                  code: CodeBlock,
                }}
              />
            </div>
            <div className="cl_Post_Content">
              Lesson
              <ReactMarkdown
                className="cl_Post_Contents"
                source={content}
                renderers={{
                  code: CodeBlock,
                }}
              />
            </div>
          </div>
          <div className="cl_Post_Tags cl_Post_set">
            <List
              dataSource={['react', 'redux']}
              renderItem={(item) => (
                <span>
                  <Tag color={colorArray[getRandomInt(0, 10)]}>{item}</Tag>
                </span>
              )}
            />
            <Popover content={Likes + ' Likes'}>
              <Icon
                type="heart"
                className="cl_PlainPost_Like"
                onClick={() => this.handleIsLikeState()}
                style={(color = { color })}
              />
            </Popover>
          </div>
          <List
            className="cl_PlainPost_Comments "
            header={`${data.length} replies`}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <li>
                <Comment
                  actions={item.actions}
                  author={item.author}
                  avatar={item.avatar}
                  content={item.content}
                  datetime={item.datetime}
                />
              </li>
            )}
          />
          <div className="cl_Post_Comments_Add cl_Post_set">
            <TextArea
              className="cl_Post_Comments_Add"
              placeholder="Write your feedback !"
              autoSize={{ minRows: 1, maxRows: 6 }}
            />
          </div>
          <Button type="primary" className="cl_Post_Comments_Add_Btn">
            Feedback
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
    handleTheme: (theme, title, contents) => {
      dispatch(currentPost(theme, title, contents));
    },
    handlePage: (page) => {
      dispatch(currentPage(page));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DevPost);
