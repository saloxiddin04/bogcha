import $axios from "../plugins/axios";
import {
	forgotPasswordEndpoint,
	loginEndpoint, logoutEndpoint, passwordChangeEndpoint,
	refreshEndpoint,
	refreshTokenKeyName,
	registerEndpoint,
	tokenKeyName,
	userKeyName, verifyEndpoint,
} from "./jwt.config";

export function login(...args) {
	return $axios.post(loginEndpoint, ...args).then((res) => {
		setAccessToken(res.data.access);
		setRefreshToken(res.data.refresh);
		parseJwt(res?.data?.access)
		setCookie("permissions", res?.data?.permissions)
	});
}

export function logout(...args) {
	document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "permissions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	
	window.location.href = "/login";
	return $axios.post(logoutEndpoint, ...args).then(() => {
		document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "permissions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		
		window.location.href = "/login";
	})
	// localStorage.clear()
	// window.location.reload();
}

export function setAccessToken(value) {
	setCookie(tokenKeyName, value, 7);
}

export function getAccessToken() {
	return getCookie(tokenKeyName);
}

export function setRefreshToken(value) {
	setCookie(refreshTokenKeyName, value, 7);
}

export function getRefreshToken() {
	return getCookie(refreshTokenKeyName);
}

export function parseJwt(token) {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	setUserData(JSON.parse(jsonPayload))
	return JSON.parse(jsonPayload);
}

export function setUserData(value) {
	setCookie(userKeyName, JSON.stringify(value), 7);
}

export function getUserData() {
	const cookies = document.cookie.split(";");
	const userCookie = cookies.find((cookie) => cookie.includes("user="));
	
	if (userCookie) return JSON.parse(userCookie.split("=")[1] || '{}');
}

export function setCookie(name, value, expirationDays) {
	const date = new Date();
	date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
	const expires = "expires=" + date.toUTCString();
	// document.cookie = `${name}=${value};${expires};path=/;SameSite=None;Secure`;
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(name) {
	const cookieString = document.cookie;
	const cookieArray = cookieString.split("; ");
	for (const cookie of cookieArray) {
		const [key, value] = cookie.split("=");
		if (key === name) {
			return value;
		}
	}
	return null;
}

export const hasPermission = (required) => {
	const permissionList = getCookie("permissions")
	if (!required) return true;
	return permissionList.includes(required);
};