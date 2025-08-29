import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {getUserData, logout, getAccessToken, getRefreshToken} from "./jwtService";

const WebSocketHandler = () => {
	const ws = useRef(null);
	const reconnectInterval = useRef(null);
	const navigate = useNavigate();
	const user = getUserData();
	const token = getAccessToken()
	const refresh = getRefreshToken()
	
	const connectWebSocket = () => {
		if (!user?.id) return;
		
		// ws.current = new WebSocket(`ws://0.0.0.0:8048/ws/?token=${token}`);
		// ws.current = new WebSocket(`ws://192.168.31.21:8048/ws/?token=${token}`);
		ws.current = new WebSocket(`ws://8aac109249db.ngrok-free.app/ws/?token=${token}`);
		// ws.current = new WebSocket(`ws://95.46.96.185:2990/ws/?token=${token}`);
		
		ws.current.onopen = () => {
			console.log('✅ WebSocket connected');
			clearInterval(reconnectInterval.current); // reconnect bo‘lsa, interval to‘xtaydi
		};
		
		ws.current.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (
				message.action === "user_permission_update" &&
				message.data.includes(`Log out user ${user.id}`)
			) {
				logout({refresh}).then()
				navigate("/login");
			}
		};
		
		ws.current.onclose = () => {
			console.warn('⚠️ WebSocket disconnected, retrying in 5 seconds...');
			if (!reconnectInterval.current) {
				reconnectInterval.current = setInterval(() => {
					console.log("🔁 Trying to reconnect WebSocket...");
					connectWebSocket();
				}, 5000);
			}
		};
		
		ws.current.onerror = (err) => {
			console.error('WebSocket error:', err);
			ws.current.close(); // xavfsizlik uchun
		};
	};
	
	useEffect(() => {
		connectWebSocket();
		
		return () => {
			ws.current?.close();
			clearInterval(reconnectInterval.current);
		};
	}, [user?.id]);
	
	return null;
};

export default WebSocketHandler;
