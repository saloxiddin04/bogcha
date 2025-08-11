import React, {useEffect} from 'react';
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import TitleCard from "../../components/Cards/TitleCard";
import {useDispatch, useSelector} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import {PencilIcon} from "@heroicons/react/20/solid";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import Loader from "../../containers/Loader";
import Pagination from "../../components/Pagination";
import {getRoles} from "./rolesSlice";
import {useNavigate} from "react-router-dom";
import {hasPermission} from "../../auth/jwtService";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewLeadModal = () => {
		dispatch(openModal({title: "Add New Role", bodyType: MODAL_BODY_TYPES.ROLE_ADD_NEW}))
	}
	
	return (
		<div className="inline-block float-right">
			{hasPermission("role_add") && (
				<button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New Role
				</button>
			)}
		</div>
	)
}

const Roles = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {loading, roles} = useSelector((state) => state.roles)
	
	useEffect(() => {
		dispatch(getRoles())
	}, [dispatch])
	
	const deleteCurrentRole = (id) => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this role?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_ROLE',
				payload: id
			}
		}));
	};
	
	const openAddNewRoleModal = (id) => {
		dispatch(openModal({
			title: "Edit Role",
			bodyType: MODAL_BODY_TYPES.ROLE_ADD_NEW,
			extraObject: {
				notification: 'Successfully edited!',
				id,
				is_edit: true
			}
		}))
	}
	
	const handlePageChange = (page) => {
		dispatch(getRoles({page_size: 1, page}))
	};
	
	return (
		<div>
			<TitleCard title="Current Roles" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				
				{hasPermission("role_table") && (
					<>
						<div className="overflow-x-auto w-full">
							{loading ? <Loader/> : (
								<table className="table w-full">
									<thead>
									<tr className="text-center">
										<th>ID</th>
										<th>Name</th>
										<th>Status</th>
										<th>Actions</th>
									</tr>
									</thead>
									<tbody>
									{roles?.results?.map((item) => (
										<tr key={item?.id} className="text-center">
											<td>{item?.id}</td>
											<td>{item?.name}</td>
											<td>{item?.is_active ? "Active" : "No active"}</td>
											<td className="flex gap-1 justify-center">
												<button
													className="btn btn-sm btn-error text-white"
													onClick={() => deleteCurrentRole(item?.id)}
													disabled={!hasPermission("role_del")}
												>
													<TrashIcon className="w-6"/>
												</button>
												<button
													className="btn btn-sm btn-warning text-white"
													onClick={() => openAddNewRoleModal(item?.id)}
													disabled={!hasPermission("role_edit")}
												>
													<PencilIcon className="w-6"/>
												</button>
												<button
													className="btn btn-sm btn-success text-white"
													onClick={() => navigate(`${item?.id}`)}
													disabled={!hasPermission("role_det")}
												>
													<ChevronRightIcon className="w-6"/>
												</button>
											</td>
										</tr>
									))}
									</tbody>
								</table>
							)}
						</div>
						
						<Pagination
							totalItems={roles?.count}
							itemsPerPage={10}
							onPageChange={handlePageChange}
						/>
					</>
				)}
			</TitleCard>
		</div>
	);
};

export default Roles;