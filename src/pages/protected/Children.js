import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";
import ChildrenPage from "../../features/childrenPage";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Children"}))
	}, [dispatch])
	
	return (
		<div>
			<ChildrenPage/>
		</div>
	);
};

export default InternalPage;