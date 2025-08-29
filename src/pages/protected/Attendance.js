import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";
import Attendance from "../../features/Attendance";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Attendance"}))
	}, [dispatch])
	
	return (
		<div>
			<Attendance />
		</div>
	);
};

export default InternalPage;