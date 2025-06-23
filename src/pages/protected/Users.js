import React, {useEffect} from 'react';
import Users from "../../features/users"
import {setPageTitle} from "../../features/common/headerSlice";
import {useDispatch} from "react-redux";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Users"}))
	}, [dispatch])
	
	return (
		<div>
			<Users/>
		</div>
	);
};

export default InternalPage;