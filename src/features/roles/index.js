import React from 'react';
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import TitleCard from "../../components/Cards/TitleCard";
import {useDispatch} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import {PencilIcon} from "@heroicons/react/20/solid";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewLeadModal = () => {
		dispatch(openModal({title: "Add New Role", bodyType: MODAL_BODY_TYPES.ROLE_ADD_NEW}))
	}
	
	return (
		<div className="inline-block float-right">
			<button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewLeadModal()}>Add New Role</button>
		</div>
	)
}

const Roles = () => {
	
	return (
		<div>
			<TitleCard title="Current Roles" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				
				{/* Leads List in table format loaded from slice after api call */}
				<div className="overflow-x-auto w-full">
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
						<tr className="text-center">
							<td>
								1
							</td>
							<td>test</td>
							<td>Active</td>
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
				</div>
			</TitleCard>
		</div>
	);
};

export default Roles;