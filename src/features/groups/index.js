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

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewLeadModal = () => {
		dispatch(openModal({title: "Add New User", bodyType: MODAL_BODY_TYPES.USER_ADD_NEW}))
	}
	
	return (
		<div className="inline-block float-right">
			<button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New Group</button>
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
	
	return (
		<>
			<TitleCard title="Current Groups" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				
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
								groups?.map((item, index) => {
									return (
										<tr key={item?.id}>
											<td>{item?.id}</td>
											<td>{item?.name}</td>
											<td>{item?.teachers?.map(teacher => teacher?.full_name).join(', ')}</td>
											<td>{item?.children_count}</td>
											<td className="flex gap-1 justify-center">
												<button
													className="btn btn-square btn-error text-white"
													// onClick={() => deleteCurrentUser(item?.id)}
												>
													<TrashIcon className="w-5"/>
												</button>
												<button
													className="btn btn-square btn-warning text-white"
													// onClick={() => openAddNewUserModal(item?.id)}
												>
													<PencilIcon className="w-5"/>
												</button>
												<button
													className="btn btn-square btn-success text-white"
													// onClick={() => openAddNewUserModal(item?.id)}
												>
													<ChevronRightIcon className="w-5"/>
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
					totalItems={groups?.count}
					itemsPerPage={10}
					onPageChange={handlePageChange}
				/>
			</TitleCard>
		</>
	);
};

export default Groups;