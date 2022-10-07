import React , {useState ,useEffect}from 'react';
import { BarLoader } from 'react-spinners';
import VidCard from './VidCard';
import { useGetAllVideosQuery } from '../services/nodeApi';
import LoadingBar from 'react-top-loading-bar';


export default function Home({type}) {
  const [videos, setVideos] = useState([]);
  const [progress , setProgress] = useState(0);
  const {data , isLoading} = useGetAllVideosQuery(type);
  useEffect(() => {
    setProgress(70)
  data && setVideos(data.vids);
  setProgress(100);
  }, [data]);
  return (
    <>
     <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
   {isLoading && videos.length===0 ?
  <div className='row' style={{justifyContent:'center',marginTop:'4rem',alignItems:'center'}}>
    <BarLoader color='#44cbb1' size={13}/>
  </div>:
  <div className='row'>
  {videos && videos.map((vid,i)=>(
    <div key={i} className='col-3 mx-4 my-3'>
      <VidCard key={i} video={vid}/>
    </div>
  ))}

</div>
}
    </>
  )
}
