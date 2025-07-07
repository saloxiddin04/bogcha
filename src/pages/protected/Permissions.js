import React, {useEffect} from 'react';
import PermissionsPage from "../../features/permissions";
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";

const Permissions = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Permissions"}))
	}, [dispatch])
	
	return (
		<div>
			<PermissionsPage/>
		</div>
	);
};

export default Permissions;