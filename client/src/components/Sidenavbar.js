import React , {useContext} from 'react'
import { Link, Outlet ,useLocation } from 'react-router-dom'
import appContext from '../context/appContext';
import jwtDecode from 'jwt-decode';
import { useGetUserQuery } from '../services/nodeApi';
import Navbar from './Navbar';
import './css/sideNavbar.css'
import {HomeOutlined , HomeFilled, CompassOutlined , CompassFilled , MoneyCollectOutlined ,MoneyCollectFilled, PlayCircleOutlined ,PlayCircleFilled} from "@ant-design/icons";


export default function Sidenavbar() {
    const location=useLocation();
    const { Cookies } = useContext(appContext);
    let id;
    if(Cookies.get('jwt')){
      id = jwtDecode(Cookies.get('jwt')).id;
    }
    const {data,isLoading} = useGetUserQuery(id);




  return (
    <>
    <div style={{paddingBottom:'5rem'}}>
      <Navbar/>
    </div>
      <div className='row'>
        <div className='col-2'>
<aside className="w-64" aria-label="Sidebar" style={{height:'42rem', position:'fixed',overflowY:'scroll'}}>
   <div className="overflow-y-auto py-3 ps-4 pe-2 rounded dark:bg-gray-800">
      <ul className="space-y-2 border-b border-gray-200" style={{paddingLeft:'0rem'}}>
      <li>
      <Link to='/dashboard/home' className={`${ location.pathname.endsWith( "home" ) || location.pathname.endsWith("d") || location.pathname.endsWith("/")? 'side_active': ''} flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  dark:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700`}>
              { location.pathname.endsWith( "home" )|| location.pathname.endsWith("d") || location.pathname.endsWith("/")? <HomeFilled/>: <HomeOutlined/>}
               <span className="flex-1 ml-3 whitespace-nowrap">Home</span>
      </Link>
      </li>
         <li>
            <Link to='/dashboard/explore' className={`${location.pathname.endsWith( "explore" )? 'side_active':''} flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:text-gray-900  hover:bg-gray-100 dark:hover:bg-gray-700`}>
            { location.pathname.endsWith( "explore" )? <CompassFilled/>: <CompassOutlined/>}<span className="flex-1 ml-3 whitespace-nowrap">Explore</span>
               <span className="inline-flex justify-center items-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
            </Link>
         </li>
         <li>
            <Link to='/dashboard/subscription' className={` ${location.pathname.endsWith( "subscription" )? 'side_active':''} flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:text-gray-900  hover:bg-gray-100 dark:hover:bg-gray-700`}>
            { location.pathname.endsWith( "subscription" )? <MoneyCollectFilled/>: <MoneyCollectOutlined/>}<span className="flex-1 ml-3 whitespace-nowrap">Subscriptions</span>
               <span className="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">3</span>
            </Link>
         </li>
         <li className='pb-3'>
            <Link to='/dashboard/library' className={` ${location.pathname.endsWith('library')?"side_active":''}  flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700`}>
            { location.pathname.endsWith( "library" )? <PlayCircleFilled/>: <PlayCircleOutlined/>}<span className="flex-1 ml-3 whitespace-nowrap">Library</span>
            </Link>
         </li>
      </ul>
      {!data &&
      <div id="dropdown-cta" className="p-4 mt-6 bg-blue-50 rounded-lg dark:bg-blue-900" role="alert">
         <div className="flex items-center mb-3">
            <span className="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Beta</span>
         </div>
         <p className="mb-3 text-sm text-blue-900 dark:text-blue-400">
            You can turn the new navigation off for a limited time in your profile.
         </p>
         <Link className="text-sm text-blue-900 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" to="/dashboard/signup">Sign up now</Link>
      </div>}

      <ul className={`pt-4 mt-4 space-y-2 ${!data && "border-t"} border-gray-200 dark:border-gray-700`} style={{paddingLeft:'0rem'}}>
        <li>
          <h5 className="pb-2" style={{textAlign:'center'}}>Youflix Trendings</h5>
        </li>
       
         <li>
            <Link to='/'  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
             
               <span className="ml-3">Documentation</span>
            </Link>
         </li>
         <li>
            <Link to='/'  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"> 
               <span className="ml-3">Components</span>
            </Link>
         </li>
         <li>
            <Link to='/' className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
              
               <span className="ml-3">Help</span>
            </Link>
         </li>
      </ul>
   </div>
</aside>
</div>
<div className='col-10 pt-4'>
  <Outlet/>
</div>
      </div>
</>
  )
}
