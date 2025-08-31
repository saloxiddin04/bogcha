import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import {hasPermission} from "../../auth/jwtService";
import {useNavigate} from "react-router-dom";
import TitleCard from "../../components/Cards/TitleCard";
import {ChevronRightIcon, PencilIcon, TrashIcon, XCircleIcon} from "@heroicons/react/20/solid";
import Pagination from "../../components/Pagination";
import {getAttendanceList} from "./attendanceSlice";
import InputText from "../../components/Input/InputText";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const [search, setSearch] = useState("")
	const timeoutId = useRef()
	
	const openAddNewLeadModal = () => {
		dispatch(openModal({title: "Add New Attendance", bodyType: MODAL_BODY_TYPES.ADD_ATTENDANCE_MODAL}))
	}
	
	const searchPlan = (value) => {
		setSearch(value)
		clearTimeout(timeoutId.current)
		timeoutId.current = setTimeout(() => {
			dispatch(getAttendanceList({search: value}))
		}, 500)
	}
	
	return (
		<div className="flex justify-between items-end gap-2 w-full">
			{/*{hasPermission("plan_s") && (*/}
				<div className="w-1/3 flex gap-2 items-end">
					<InputText
						type="text"
						defaultValue={search ?? ""}
						updateType="search"
						labelTitle="Search"
						updateFormValue={({value}) => searchPlan(value)}
					/>
					<button
						className="btn px-6 btn-sm normal-case btn-error"
						onClick={() => {
							setSearch("")
							dispatch(getAttendanceList({page: 1, page_size: 10}))
						}}
					>
						<XCircleIcon className="w-6"/>
					</button>
				</div>
			{/*)}*/}
			{/*{hasPermission("plan_a") && (*/}
				<button
					className="btn px-6 btn-sm normal-case btn-primary"
					onClick={() => openAddNewLeadModal()}
				>
					Add New Attendance
				</button>
			{/*)}*/}
		</div>
	)
}

const Attendance = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {attendanceList} = useSelector((state) => state.attendance)
	
	useEffect(() => {
		dispatch(getAttendanceList({page: 1, page_size: 10}))
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getAttendanceList({page_size: 10, page}))
	}
	
	const openAddNewAttendanceModal = (id) => {
		dispatch(openModal({
			title: "Update New Attendance",
			bodyType: MODAL_BODY_TYPES.ADD_ATTENDANCE_MODAL,
			extraObject: {
				is_edit: true,
				id,
				notification: 'Successfully edited!',
			}
		}))
	}
	
	const deleteCurrentAttendance = (id) => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this attendance list?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_ATTENDANCE',
				payload: id
			}
		}));
	};
	
	return (
		<div>
			<TitleCard title="Current Attendance" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				<>
					<div className="overflow-x-auto w-full">
						<table className="table w-full">
							<thead>
							<tr className="text-center">
								<th>ID</th>
								<th>Title</th>
								<th>Person type</th>
								<th>Group</th>
								<th>Users</th>
								<th>Actions</th>
							</tr>
							</thead>
							<tbody>
							{attendanceList?.data?.map((item) => (
								<tr className="text-center" key={item?.id}>
									<td>{item?.id}</td>
									<td>{item?.title}</td>
									<td>{item?.person_type}</td>
									<td>{item?.group?.name}</td>
									<td>{item?.users?.length}</td>
									<td className="flex gap-1 justify-center">
										<button
											className="btn btn-sm btn-error text-white"
											onClick={() => deleteCurrentAttendance(item?.id)}
											// disabled={!hasPermission("plan_d_del")}
										>
											<TrashIcon className="w-6"/>
										</button>
										<button
											className="btn btn-sm btn-warning text-white"
											onClick={() => openAddNewAttendanceModal(item?.id)}
											// disabled={!hasPermission("plan_d_e")}
										>
											<PencilIcon className="w-6"/>
										</button>
										<button
											className="btn btn-sm btn-success text-white"
											onClick={() => navigate(`${item?.id}`)}
											// disabled={!hasPermission("plan_d_det")}
										>
											<ChevronRightIcon className="w-6"/>
										</button>
									</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
					
					<Pagination
						totalItems={attendanceList?.pagination?.total_items}
						itemsPerPage={10}
						onPageChange={handlePageChange}
					/>
				</>
			</TitleCard>
		</div>
	);
};

export default Attendance;