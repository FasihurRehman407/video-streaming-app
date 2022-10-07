import React , {useContext}from 'react';
import 'antd/dist/antd.css';
import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom";
import Sidenavbar from './components/Sidenavbar';
import Home from './components/Home';
import Signup from './components/Signup';
import Library from './components/Library';
import ProtectedRoutes from './components/ProtectedRoutes';
import appContext from './context/appContext';
import jwtDecode from 'jwt-decode';
import Video from './components/Video';


function App() {
  const { Cookies } = useContext(appContext);
  let id;
  if(Cookies.get('jwt')){
   id=jwtDecode(Cookies.get('jwt'));
  }

  return (
    <>
    <Routes>
      <Route exact path='/dashboard' element={
        <Sidenavbar/>
      }>
        <Route exact path='' element={
        <Home type="random"/>
      }/>
        <Route exact path='home' element={
        <Home type="random"/>
      }/>
       <Route exact path='explore' element={
        <Home type="trend"/>
      }/>  
      <Route exact  path='subscription' element={
          <Home type="subvids"/>
      }/> 
      <Route exact  path='library' element={
        <Library/>
      }/>
      <Route exact path='signup' element={
        <ProtectedRoutes auth={id? true: false}>
          <Signup/>
        </ProtectedRoutes>
      }/>
      <Route exact path='video'>
        <Route path=":id" element={<Video/>}/>
      </Route>
      </Route> 
    </Routes>
 
    </>
  );
}

export default App;
