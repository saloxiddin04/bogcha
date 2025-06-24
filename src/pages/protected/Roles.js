import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";
import Roles from "../../features/roles";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Roles"}))
	}, [dispatch])
	
	return (
		<div>
			<Roles/>
		</div>
	);
};

export default InternalPage;