import {getAccessToken, getRefreshToken, logout} from "../auth/jwtService.js";
import axios from "axios";
import store from "../app/store";
import {showNotification} from "../features/common/headerSlice";

const instance = axios.create({
	baseURL: "https://09ac667850b4.ngrok-free.app/api/v1", //ngrok
	// baseURL: "http://95.46.96.185/api/v1", //local_server
	// baseURL: "http://0.0.0.0:8048/api/v1", //local_server
	// baseURL: "https://barakalla.uz/api/v1", // server
	timeout: 20000,
	
	headers: {
		Accept: "application/json",
		"ngrok-skip-browser-warning": true
	},
});

//send token
instance.interceptors.request.use(
	(config) => {
		let token = getAccessToken();
		if (token && config.headers) {
			config.headers.Authorization = "Bearer " + token;
		}
		
		return config;
	},
	(error) => {
		console.log("error", error)
		// toast.error(error?.message)
		return Promise.reject(error);
	}
);

// instance.interceptors.response.use(
// 	(response) => {
// 		console.log(response)
// 		return response
// 	},
// 	(error) => {
// 		console.log("error", error)
// 		if (error.response && error.response.status === 401) {
// 			if (
// 				window.location.pathname !== "/login" &&
// 				window.location.pathname !== "/register"
// 			) {
// 				window.location.href = "/login";
// 				const refresh = getRefreshToken()
// 				logout({refresh}).then()
// 				// window.location.reload()
// 			}
// 		}
// 		// else if (error.response.status === 422) {
// 		//   console.log("422", error.response);
// 		// } else if (error.response.status === 500) {
// 		//   toast.error("Error from server!");
// 		// }
// 		store.dispatch(showNotification({status: 0, message: error?.response?.data?.message}));
// 		return Promise.reject(error);
// 	}
// );

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status;
		
		const refresh = getRefreshToken();
		const access = getAccessToken()
		
		if (status === 401) {
			if (
				window.location.pathname !== "/login" &&
				window.location.pathname !== "/register"
			) {
				try {
					await logout({refresh, headers: {Authorization: `Bearer ${access}`}});
				} catch (e) {
					const refresh = getRefreshToken();
					await logout({refresh, headers: {Authorization: `Bearer ${access}`}});
					console.error("Logout error:", e);
				} finally {
					const refresh = getRefreshToken();
					await logout({refresh, headers: {Authorization: `Bearer ${access}`}});
					window.location.href = "/login";
				}
			}
		}
		
		if (status && status !== 401) {
			store.dispatch(
				showNotification({
					status: 0,
					message: error?.response?.data?.message || "Server error",
				})
			);
		}
		
		return Promise.reject(error);
	}
);

export default instance;