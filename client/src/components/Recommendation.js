import React from 'react';
import { List} from 'antd';
import './css/recommendation.css';
import RecommendationCard from './RecommendationCard';

export default function Recommendation() {
    const data = [
        <RecommendationCard/>,
        <RecommendationCard/>,
        <RecommendationCard/>,
        <RecommendationCard/>,
        <RecommendationCard/>,
        <RecommendationCard/>,
        <RecommendationCard/>,
    ];
  return (
    <div className='recommendation' style={{marginRight:'10rem'}}>
        <List
      dataSource={data}
      renderItem={item => (
        <List.Item>
          {item}
        </List.Item>
      )}
    />
    </div>
  )
}
