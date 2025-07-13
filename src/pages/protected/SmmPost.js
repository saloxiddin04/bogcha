import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../features/common/headerSlice";
import SmmPost from "../../features/smmPost";

const InternalPage = () => {
	const dispatch = useDispatch()
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "SMM Post"}))
	}, [dispatch])
	
	return (
		<div>
			<SmmPost/>
		</div>
	);
};

export default InternalPage;