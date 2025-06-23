import React from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../auth/jwtService";

const ProtectedRoute = ({ children }) => {
	const token = getAccessToken();
	
	if (!token) {
		return <Navigate to="/login" replace />;
	}
	
	return children;
};

export default ProtectedRoute;
