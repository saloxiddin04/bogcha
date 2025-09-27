// import React, {useEffect, useState} from 'react';
// import {useDispatch, useSelector} from "react-redux";
// import TitleCard from "../../components/Cards/TitleCard";
// import {useParams} from "react-router-dom";
// import {getAllPermissions, getChildPermissions, updatePermission} from "./permissionsSlice";
// import ToggleInput from "../../components/Input/ToggleInput";
// import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
// import {showNotification} from "../common/headerSlice";
//
// const TopSideButtons = ({onClick}) => {
//
// 	return (
// 		<div className="inline-block float-right">
// 			<button className="btn px-6 btn-sm normal-case btn-primary" onClick={onClick}>Save</button>
// 		</div>
// 	)
// }
//
// const InternalPage = () => {
// 	const dispatch = useDispatch()
//
// 	const {id} = useParams()
//
// 	const {permissions, loading, permission} = useSelector(state => state.permissions)
//
// 	const [expandedParents, setExpandedParents] = useState([]);
//
// 	const [trueIds, setTrueIds] = useState([]);
// 	const [falseIds, setFalseIds] = useState([]);
//
// 	useEffect(() => {
// 		if (id) {
// 			dispatch(getAllPermissions(id))
// 		}
// 	}, [id, dispatch])
//
// 	const handleToggleChildren = (parentId) => {
// 		setExpandedParents(prev =>
// 			prev.includes(parentId)
// 				? prev.filter(id => id !== parentId)
// 				: [...prev, parentId]
// 		);
//
// 		if (!permission?.[parentId]) {
// 			dispatch(getChildPermissions({roleId: id, parentId}));
// 		}
// 	};
//
// 	const handleToggleChange = (id, currentValue) => {
// 		const newValue = !currentValue;
//
// 		if (newValue === true) {
// 			// Agar ON bo‘layotgan bo‘lsa
// 			setTrueIds((prev) => prev.includes(id) ? prev : [...prev, id]);
// 			setFalseIds((prev) => prev.filter((item) => item !== id));
// 		} else {
// 			// Agar OFF bo‘layotgan bo‘lsa
// 			setFalseIds((prev) => prev.includes(id) ? prev : [...prev, id]);
// 			setTrueIds((prev) => prev.filter((item) => item !== id));
// 		}
// 	};
//
// 	const updateFunc = () => {
// 		dispatch(updatePermission({
// 			true_ids: trueIds,
// 			false_ids: falseIds,
// 			role: id
// 		})).then(({payload}) => {
// 			if (payload?.status === 200) {
// 				dispatch(showNotification({
// 					message: "Permission updated!",
// 					status: 1
// 				}));
// 			} else {
// 				dispatch(showNotification({status: 0}));
// 			}
// 		})
// 	}
//
// 	console.log(permission)
//
// 	return (
// 		<div>
// 			<TitleCard title={permissions?.role?.name} topMargin="mt-2" TopSideButtons={<TopSideButtons onClick={updateFunc}/>}>
// 				<div className="overflow-x-auto w-full">
// 					{
// 						<div className="flex justify-center flex-col w-full">
// 							{permissions?.results?.map((item) => {
// 								const isExpanded = expandedParents.includes(item?.module?.id);
// 								return (
// 									<div
// 										key={item?.module?.unique_name}
// 										className="flex flex-col lg:flex-row lg:items-center gap-4 p-2 rounded-xl"
// 									>
// 										{/* PARENT MODULE */}
// 										<div className="flex items-center justify-between gap-2 min-w-[250px] border p-2 rounded">
// 											<span className="font-semibold text-base">{item?.module?.name}</span>
// 											<div className="flex items-center gap-2">
// 												{item?.has_children && (
// 													<button
// 														className="transition"
// 														onClick={() => handleToggleChildren(item?.module?.id)}
// 													>
// 														<ChevronRightIcon className={`w-5 h-5 transform ${isExpanded ? 'rotate-90' : ''}`}/>
// 													</button>
// 												)}
// 												<ToggleInput
// 													updateType="status"
// 													defaultValue={item?.is_active}
// 													updateFormValue={() => handleToggleChange(item?.module?.id, item?.is_active)}
// 													containerStyle="w-1/4"
// 												/>
// 											</div>
// 										</div>
//
// 										{/* CHILD MODULES */}
// 										{isExpanded && (
// 											<div className="flex flex-wrap gap-4">
// 												{(permission?.[item?.module?.id] || []).map((child) => (
// 													<div
// 														key={child?.module?.unique_name}
// 														className="flex items-center justify-between gap-2 px-3 py-2 rounded border w-full sm:w-auto"
// 													>
// 														{child?.has_children && (
// 															<button
// 																className="transition"
// 																onClick={() => handleToggleChildren(item?.module?.id)}
// 															>
// 																<ChevronRightIcon className={`w-5 h-5 transform ${isExpanded ? 'rotate-90' : ''}`}/>
// 															</button>
// 														)}
// 														<span className="text-sm whitespace-nowrap">{child?.module?.name}</span>
// 														<ToggleInput
// 															updateType="status"
// 															defaultValue={child?.is_active}
// 															updateFormValue={() => handleToggleChange(child?.module?.id, child?.is_active)}
// 														/>
// 													</div>
// 												))}
// 											</div>
// 										)}
// 									</div>
// 								);
// 							})}
//
// 						</div>
// 					}
// 				</div>
// 			</TitleCard>
// 		</div>
// 	);
// };
//
// export default InternalPage;

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import {useParams} from "react-router-dom";
import {getAllPermissions, getChildPermissions, updatePermission} from "./permissionsSlice";
import ToggleInput from "../../components/Input/ToggleInput";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import {showNotification} from "../common/headerSlice";

const TopSideButtons = ({onClick}) => {
	return (
		<div className="inline-block float-right">
			<button className="btn px-6 btn-sm normal-case btn-primary" onClick={onClick}>Save</button>
		</div>
	)
}

// Recursive component
// const PermissionItem = ({
// 	                        item,
// 	                        expandedParents,
// 	                        setExpandedParents,
// 	                        handleToggleChange,
// 	                        handleToggleChildren,
// 	                        permission,
// 	                        roleId
//                         }) => {
// 	const isExpanded = expandedParents.includes(item?.module?.id);
//
// 	return (
// 		<div className="flex items-center">
// 			{/* Parent */}
// 			<div className="flex items-center justify-between gap-2 border p-2 rounded min-w-[250px]">
// 				<div className="flex items-center gap-2">
// 					{item?.has_children && (
// 						<button
// 							className="transition"
// 							onClick={() => handleToggleChildren(item?.module?.id, roleId)}
// 						>
// 							<ChevronRightIcon
// 								className={`w-5 h-5 transform ${isExpanded ? "rotate-90" : ""}`}
// 							/>
// 						</button>
// 					)}
// 					<span className="text-sm font-medium">{item?.module?.name}</span>
// 				</div>
//
// 				<ToggleInput
// 					updateType="status"
// 					defaultValue={item?.is_active}
// 					updateFormValue={() =>
// 						handleToggleChange(item?.module?.id, item?.is_active)
// 					}
// 				/>
// 			</div>
//
// 			{/* Children yonidan chiqadi */}
// 			{isExpanded && permission?.[item?.module?.id] && (
// 				<div className="flex items-center ml-4 gap-4">
// 					{permission[item?.module?.id].map((child) => (
// 						<PermissionItem
// 							key={child?.module?.unique_name}
// 							item={child}
// 							expandedParents={expandedParents}
// 							setExpandedParents={setExpandedParents}
// 							handleToggleChange={handleToggleChange}
// 							handleToggleChildren={handleToggleChildren}
// 							permission={permission}
// 							roleId={roleId}
// 						/>
// 					))}
// 				</div>
// 			)}
// 		</div>
// 	);
// };

const PermissionItem = ({
	                        item,
	                        expandedParents,
	                        setExpandedParents,
	                        handleToggleChange,
	                        handleToggleChildren,
	                        permission,
	                        roleId
                        }) => {
	const isExpanded = expandedParents.includes(item?.module?.id);
	
	return (
		<div className="flex flex-col gap-2">
			{/* Parent / Child Row */}
			<div className="flex items-center justify-between gap-2 border p-2 rounded">
				<div className="flex items-center gap-2 w-2/3">
					{item?.has_children && (
						<button
							className="transition"
							onClick={() => handleToggleChildren(item?.module?.id, roleId)}
						>
							<ChevronRightIcon
								className={`w-5 h-5 transform ${isExpanded ? "rotate-90" : ""}`}
							/>
						</button>
					)}
					<span className="text-sm font-medium">{item?.module?.name}</span>
				</div>
				
				<ToggleInput
					updateType="status"
					defaultValue={item?.is_active}
					updateFormValue={() =>
						handleToggleChange(item?.module?.id, item?.is_active)
					}
				/>
			</div>
			
			{/* Recursive Children */}
			{isExpanded && permission?.[item?.module?.id] && (
				<div className="flex flex-col gap-2 ml-6">
					{permission[item?.module?.id].map((child) => (
						<PermissionItem
							key={child?.module?.unique_name}
							item={child}
							expandedParents={expandedParents}
							setExpandedParents={setExpandedParents}
							handleToggleChange={handleToggleChange}
							handleToggleChildren={handleToggleChildren}
							permission={permission}
							roleId={roleId}
						/>
					))}
				</div>
			)}
		</div>
	);
};


const InternalPage = () => {
	const dispatch = useDispatch();
	const {id} = useParams();
	
	const {permissions, permission} = useSelector(state => state.permissions);
	
	const [expandedParents, setExpandedParents] = useState([]);
	const [trueIds, setTrueIds] = useState([]);
	const [falseIds, setFalseIds] = useState([]);
	
	useEffect(() => {
		if (id) {
			dispatch(getAllPermissions(id));
		}
	}, [id, dispatch]);
	
	const handleToggleChildren = (parentId, roleId) => {
		setExpandedParents(prev =>
			prev.includes(parentId)
				? prev.filter(i => i !== parentId)
				: [...prev, parentId]
		);
		
		if (!permission?.[parentId]) {
			dispatch(getChildPermissions({roleId, parentId}));
		}
	};
	
	const handleToggleChange = (id, currentValue) => {
		const newValue = !currentValue;
		
		if (newValue === true) {
			setTrueIds((prev) => prev.includes(id) ? prev : [...prev, id]);
			setFalseIds((prev) => prev.filter((item) => item !== id));
		} else {
			setFalseIds((prev) => prev.includes(id) ? prev : [...prev, id]);
			setTrueIds((prev) => prev.filter((item) => item !== id));
		}
	};
	
	const updateFunc = () => {
		dispatch(updatePermission({
			true_ids: trueIds,
			false_ids: falseIds,
			role: id
		})).then(({payload}) => {
			if (payload?.status === 200) {
				dispatch(showNotification({
					message: "Permission updated!",
					status: 1
				}));
			}
		});
	};
	
	return (
		<div>
			<TitleCard
				title={permissions?.role?.name}
				topMargin="mt-2"
				TopSideButtons={<TopSideButtons onClick={updateFunc}/>}
			>
				<div className="overflow-x-auto w-full">
					<div className="flex flex-col gap-4">
						{permissions?.results?.map((item) => (
							<PermissionItem
								key={item?.module?.unique_name}
								item={item}
								expandedParents={expandedParents}
								setExpandedParents={setExpandedParents}
								handleToggleChange={handleToggleChange}
								handleToggleChildren={handleToggleChildren}
								permission={permission}
								roleId={id}
							/>
						))}
					</div>
				</div>
			</TitleCard>
		</div>
	);
};

export default InternalPage;
