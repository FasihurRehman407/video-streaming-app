import React from 'react';
import { Comment , Tooltip , Avatar} from 'antd';
import { format } from 'timeago.js';
import { useGetUserQuery } from '../services/nodeApi';
import {
  UserOutlined,
 } from '@ant-design/icons';
export default function CommentCard({
  description,
  createdAt,
  userId
}) {
  const {data:user,isLoading} = useGetUserQuery(userId);
  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
      <span >
       Like
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span >
       Dislike
      </span>
    </Tooltip>,
    <span key="comment-basic-reply-to">Reply to</span>,
  ];
  return (
    <>
     {user && <Comment
      actions={actions}
      author={<span>{user.doc.name}</span>}
      avatar={<Avatar icon={<UserOutlined/>}/>}
      content={
        <p>
          {description}
        </p>
      }
      datetime={
        <Tooltip title="2016-11-22 11:22:33">
          <span>{format(createdAt)}</span>
        </Tooltip>
      }
    />}
    </>
  )
}
