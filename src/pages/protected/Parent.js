import React, {useEffect} from 'react';
import ParentPage from "../../features/Parent";
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Parent"}))
	}, [dispatch])
	
	return (
		<div>
			<ParentPage/>
		</div>
	);
};

export default InternalPage;