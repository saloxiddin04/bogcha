import React, {useEffect} from 'react';
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import TitleCard from "../../components/Cards/TitleCard";
import {useDispatch, useSelector} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import {getAllGroups} from "./groupsSlice";
import Loader from "../../containers/Loader";
import Pagination from "../../components/Pagination";
import {PencilIcon} from "@heroicons/react/20/solid";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import {hasPermission} from "../../auth/jwtService";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewGroupModal = () => {
		dispatch(openModal({title: "Add New Group", bodyType: MODAL_BODY_TYPES.GROUP_ADD_NEW}))
	}
	
	return (
		<div className="inline-block float-right">
			{hasPermission("group_add") && (
				<button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewGroupModal()}>Add New
					Group</button>
			)}
		</div>
	)
}

const Groups = () => {
	const dispatch = useDispatch()
	
	const {groups, loading} = useSelector(state => state.groups)
	
	useEffect(() => {
		dispatch(getAllGroups())
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getAllGroups({page_size: 1, page}))
	};
	
	const deleteCurrentGroup = (id) => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this group?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_GROUP',
				payload: id
			}
		}));
	};
	
	const openAddNewGroupModal = (id) => {
		dispatch(openModal({
			title: "Edit Group",
			bodyType: MODAL_BODY_TYPES.GROUP_ADD_NEW,
			extraObject: {
				notification: 'Successfully edited!',
				id,
				is_edit: true
			}
		}))
	}
	
	return (
		<>
			<TitleCard title="Current Groups" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				{hasPermission("group_t") && (
					<>
						<div className="overflow-x-auto w-full">
							{loading ? <Loader/> : (
								<table className="table w-full">
									<thead>
									<tr>
										<th>Id</th>
										<th>Name</th>
										<th>Teacher</th>
										<th>Children count</th>
										<th className="text-center">Action</th>
									</tr>
									</thead>
									<tbody>
									{
										groups?.data?.map((item) => {
											return (
												<tr key={item?.id}>
													<td>{item?.id}</td>
													<td>{item?.name}</td>
													<td>{item?.teachers?.map(teacher => teacher?.full_name).join(', ')}</td>
													<td>{item?.children_count}</td>
													<td className="flex gap-1 justify-center">
														<button
															className="btn btn-sm btn-error text-white"
															onClick={() => deleteCurrentGroup(item?.id)}
															disabled={!hasPermission("group_d")}
														>
															<TrashIcon className="w-6"/>
														</button>
														<button
															className="btn btn-sm btn-warning text-white"
															onClick={() => openAddNewGroupModal(item?.id)}
															disabled={!hasPermission("group_e")}
														>
															<PencilIcon className="w-6"/>
														</button>
														<button
															className="btn btn-sm btn-success text-white"
															onClick={() => openAddNewGroupModal(item?.id)}
															disabled={!hasPermission("group_det")}
														>
															<ChevronRightIcon className="w-6"/>
														</button>
													</td>
												</tr>
											)
										})
									}
									</tbody>
								</table>
							)}
						</div>
						
						<Pagination
							totalItems={groups?.pagination?.total_items}
							itemsPerPage={10}
							onPageChange={handlePageChange}
						/>
					</>
				)}
			</TitleCard>
		</>
	);
};

export default Groups;