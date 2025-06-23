import React from 'react';
import moment from "moment/moment";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import TitleCard from "../../components/Cards/TitleCard";
import {useDispatch, useSelector} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";

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
	const {leads} = useSelector(state => state.lead)
	
	return (
		<>
			<TitleCard title="Current Users" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				
				{/* Leads List in table format loaded from slice after api call */}
				<div className="overflow-x-auto w-full">
					<table className="table w-full">
						<thead>
						<tr>
							<th>Name</th>
							<th>Email Id</th>
							<th>Created At</th>
							<th>Status</th>
							<th>Assigned To</th>
							<th></th>
						</tr>
						</thead>
						<tbody>
						{
							leads.map((l, k) => {
								return (
									<tr key={k}>
										<td>
											<div className="flex items-center space-x-3">
												<div className="avatar">
													<div className="mask mask-squircle w-12 h-12">
														<img src={l.avatar} alt="Avatar"/>
													</div>
												</div>
												<div>
													<div className="font-bold">{l.first_name}</div>
													<div className="text-sm opacity-50">{l.last_name}</div>
												</div>
											</div>
										</td>
										<td>{l.email}</td>
										<td>{moment(new Date()).add(-5 * (k + 2), 'days').format("DD MMM YY")}</td>
										<td>test</td>
										<td>{l.last_name}</td>
										<td>
											<button
												className="btn btn-square btn-ghost"
												onClick={() => console.log("remove")}><TrashIcon className="w-5"
											/>
											</button>
										</td>
									</tr>
								)
							})
						}
						</tbody>
					</table>
				</div>
			</TitleCard>
		</>
	);
};

export default Users;