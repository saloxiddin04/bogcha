import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";
import CheckKids from "../../features/checkKids";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Check Kids"}))
	}, [dispatch])
	
	return (
		<div>
			<CheckKids/>
		</div>
	);
};

export default InternalPage;