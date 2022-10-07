import React from 'react';
import { Navigate } from "react-router-dom";


const ProtectedRoutes = ({ auth, children }) => {
    if (auth) {
    return <Navigate to="/dashboard" replace />;
    }
    return children;
   };
   export default ProtectedRoutes;