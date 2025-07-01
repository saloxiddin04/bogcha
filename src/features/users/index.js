import React, {useState} from 'react';
import moment from "moment/moment";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import TitleCard from "../../components/Cards/TitleCard";
import {useDispatch, useSelector} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import {PencilIcon} from "@heroicons/react/20/solid";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import Pagination from "../../components/Pagination";
import {useNavigate} from "react-router-dom";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewLeadModal = () => {
		dispatch(openModal({title: "Add New User", bodyType: MODAL_BODY_TYPES.USER_ADD_NEW}))
	}
	
	return (
		<div className="inline-block float-right">
			<button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New User</button>
		</div>
	)
}

const Users = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {users} = useSelector(state => state.users)
	
	const [currentPage, setCurrentPage] = useState(1);
	
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};
	
	return (
		<>
			<TitleCard title="Current Users" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				
				<div className="overflow-x-auto w-full">
					<table className="table w-full">
						<thead>
						<tr className="text-center">
							<th>ID</th>
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
						{
							users?.map((l, k) => {
								return (
									<tr key={k}>
										<td>
											ID
										</td>
										<td>
											First name
										</td>
										<td>Last name</td>
										<td>Phone number</td>
										<td>Roles</td>
										<td>Is active</td>
										<td>Birth day</td>
										<td>
											<button
												className="btn btn-square btn-ghost"
												onClick={() => console.log("remove")}
											>
												<TrashIcon className="w-5"
												/>
											</button>
											<button
												className="btn btn-square btn-ghost"
												onClick={() => console.log("remove")}
											>
												<PencilIcon className="w-5"
												/>
											</button>
										</td>
									</tr>
								)
							})
						}
						
						<tr className="text-center">
							<td>
								ID
							</td>
							<td>
								First name
							</td>
							<td>Last name</td>
							<td>Phone number</td>
							<td>Roles</td>
							<td>Is active</td>
							<td>Birth day</td>
							<td className="flex gap-1 justify-center">
								<button
									className="btn btn-square btn-error text-white"
									onClick={() => console.log("remove")}
								>
									<TrashIcon className="w-5"/>
								</button>
								<button
									className="btn btn-square btn-warning text-white"
									onClick={() => console.log("remove")}
								>
									<PencilIcon className="w-5"/>
								</button>
								<button
									className="btn btn-square btn-success text-white"
									onClick={() => console.log("remove")}
								>
									<ChevronRightIcon className="w-5"/>
								</button>
							</td>
						</tr>
						</tbody>
					</table>
					
					<Pagination
						currentPage={1}
						totalPages={10}
						onPageChange={setCurrentPage}
					/>
				</div>
			</TitleCard>
		</>
	);
};

export default Users;