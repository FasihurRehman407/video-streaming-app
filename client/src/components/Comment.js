import React from 'react';
import { List } from 'antd';
import CommentCard from './CommentCard';
import { useGetCommentsQuery } from '../services/nodeApi';
import { ClipLoader } from 'react-spinners';

export default function Comment({videoId}) {
  const {data: comments, isLoading} = useGetCommentsQuery(videoId);
  const commentsData = comments?.comments.map((el,i)=>
    {
      return <CommentCard key={i} userId={el.userId} description={el.description} createdAt={el.createdAt}/>
    })
  const data = [
    commentsData
];
  return (
    <>
    {comments ?
    <List
    itemLayout='vertical'
      dataSource={data}
      renderItem={item => (
        <List.Item>
          {item}
        </List.Item>
      )}
    /> : <ClipLoader color='#44cbb1'/>}
    </>
  )
}
