import React from 'react';
import { Image } from 'antd';

export default function RecommendationCard() {
  return (
    <>
    <div className="card mb-3 border-0" style={{"maxWidth": "540px",cursor:'pointer'}}>
  <div className="row g-0">
    <div className="col-md-3">
        <Image src="https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60" width={150}/>
    </div>
    <div className="col-md-9 ps-5">
      <div className="card-body pt-0">
        <div className="card-title trunc_line">Card title of the video is very short not so long anyway but i like</div>
        <small className="text-muted">Ninja Tech</small>
        <p className="card-text"><small className="text-muted">88k views &middot; 1 year ago</small></p>
      </div>
    </div>
  </div>
</div>
    </>
  )
}
