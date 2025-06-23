import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";
import Groups from "../../features/groups";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Groups"}))
	}, [dispatch])
	
	return (
		<div>
			<Groups />
		</div>
	);
};

export default InternalPage;