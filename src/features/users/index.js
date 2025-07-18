import React, {useEffect} from 'react';
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import TitleCard from "../../components/Cards/TitleCard";
import {useDispatch, useSelector} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import {PencilIcon} from "@heroicons/react/20/solid";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import Pagination from "../../components/Pagination";
import {getUsers} from "./usersSlice";
import Loader from "../../containers/Loader";
import {hasPermission} from "../../auth/jwtService";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewLeadModal = () => {
		dispatch(openModal({title: "Add New User", bodyType: MODAL_BODY_TYPES.USER_ADD_NEW}))
	}
	
	return (
		<div className="inline-block float-right">
			{hasPermission("user_add") && (
				<button
					className="btn px-6 btn-sm normal-case btn-primary"
					onClick={() => openAddNewLeadModal()}
				>
					Add New User
				</button>
			)}
		</div>
	)
}

const Users = () => {
	const dispatch = useDispatch()
	const {users, loading} = useSelector(state => state.users)
	
	useEffect(() => {
		dispatch(getUsers())
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getUsers({page_size: 1, page}))
	};
	
	const deleteCurrentUser = (userId) => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this user?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_USER',
				payload: userId
			}
		}));
	};
	
	const openAddNewUserModal = (userId) => {
		dispatch(openModal({
			title: "Edit User",
			bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
			extraObject: {
				notification: 'Successfully edited!',
				userId,
				is_edit: true
			}
		}))
	}
	
	
	return (
		<>
			<TitleCard title="Current Users" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				
				{hasPermission("user_table") && (
					<div className="overflow-x-auto w-full">
						{loading ? <Loader/> : (
							<table className="table w-full">
								<thead>
								<tr className="text-center">
									<th>ID</th>
									<th>Picture</th>
									<th>First name</th>
									<th>Last name</th>
									<th>Phone number</th>
									<th>Roles</th>
									<th>Is active</th>
									<th>Birthday</th>
									<th>Actions</th>
								</tr>
								</thead>
								
								<tbody>
								{users?.results?.map((item, index) => {
									return (
										<tr key={item?.id} className="text-center">
											<td>
												{item?.id}
											</td>
											<td>
												<img className="rounded-full w-full h-12 object-contain" src={item?.profile_picture} alt=""/>
											</td>
											<td>
												{item?.first_name}
											</td>
											<td>{item?.last_name}</td>
											<td>{item?.phone_number}</td>
											<td>{item?.roles?.map(role => role?.name).join(', ')}</td>
											<td>{item?.is_active ? "Active" : "No active"}</td>
											<td>{item?.birth_day}</td>
											<td className="flex gap-1 justify-center">
												<button
													className="btn btn-square btn-error text-white"
													onClick={() => deleteCurrentUser(item?.id)}
													disabled={!hasPermission("user_del")}
												>
													<TrashIcon className="w-5"/>
												</button>
												<button
													className="btn btn-square btn-warning text-white"
													onClick={() => openAddNewUserModal(item?.id)}
													disabled={!hasPermission("user_edit")}
												>
													<PencilIcon className="w-5"/>
												</button>
												<button
													className="btn btn-square btn-success text-white"
													onClick={() => openAddNewUserModal(item?.id)}
													disabled={!hasPermission("user_det")}
												>
													<ChevronRightIcon className="w-5"/>
												</button>
											</td>
										</tr>
									)
								})}
								</tbody>
							</table>
						)}
						
						<Pagination
							totalItems={users?.count}
							itemsPerPage={10}
							onPageChange={handlePageChange}
						/>
					</div>
				)}
			</TitleCard>
		</>
	);
};

export default Users;