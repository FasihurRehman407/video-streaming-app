import React from 'react';
import appContext from './appContext';
import Cook from 'js-cookie';



const appState=( props ) => {




  const Cookies=Cook.withAttributes( {
    path: '/', sameSite: 'Strict', secure: true, expires: 7, httpOnly:false
  } )




  return (

    <appContext.Provider value={{ Cookies }}>
      {props.children}
    </appContext.Provider>

  )
}

export default appState;