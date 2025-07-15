import React from 'react';
import {useDispatch} from "react-redux";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import Pagination from "../../components/Pagination";
import TitleCard from "../../components/Cards/TitleCard";
import {useNavigate} from "react-router-dom";

const CheckKids = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	return (
		<>
			<TitleCard title="Current Check child Page" topMargin="mt-2">
				<div className="overflow-x-auto w-full">
					<table className="table w-full">
						<thead>
						<tr className="text-center">
							<th>ID</th>
							<th>Name</th>
							<th>Parent</th>
							<th>Group</th>
							<th>Description</th>
							<th>Actions</th>
						</tr>
						</thead>
						<tbody>
						<tr className="text-center">
							<td>1</td>
							<td>test</td>
							<td>test</td>
							<td>test</td>
							<td>test</td>
							<td className="flex gap-1 justify-center">
								<button
									className="btn btn-square btn-success text-white"
									onClick={() => navigate("1")}
								>
									<ChevronRightIcon className="w-5"/>
								</button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				
				<Pagination
					totalItems={10}
					itemsPerPage={10}
					// onPageChange={handlePageChange}
				/>
			</TitleCard>
		</>
	);
};

export default CheckKids;