import React, {lazy, useEffect, Suspense} from 'react'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import {themeChange} from 'theme-change'

import ProtectedRoute from './routes/ProtectedRoute'
import {NotificationContainer} from "react-notifications";
import {getAccessToken} from "./auth/jwtService";

// Lazy-loaded pages
const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import("./pages/protected/404"))

function App() {
	
	const token = getAccessToken()
	
	useEffect(() => {
		themeChange(false)
	}, [])
	
	return (
		<>
			<Router>
				<Suspense fallback={<div>Loading...</div>}>
					<Routes>
						<Route
							path="/login"
							element={
								token ? <Navigate to={"/app/dashboard"} replace/> : <Login/>
							}
						/>
						
						<Route
							path="/app/*"
							element={
								<ProtectedRoute>
									<Layout/>
								</ProtectedRoute>
							}
						/>
						
						<Route
							path="*"
							element={
								<Navigate to={"/login"} replace/>
							}
						/>
					</Routes>
				</Suspense>
			</Router>
			<NotificationContainer/>
		</>
	)
}

export default App
