import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import {getAttendanceList} from "../Attendance/attendanceSlice";
import InputText from "../../components/Input/InputText";
import {ChevronRightIcon, PencilIcon, TrashIcon, XCircleIcon} from "@heroicons/react/20/solid";
import {getChildList} from "./ParentSlice";
import {useNavigate} from "react-router-dom";
import TitleCard from "../../components/Cards/TitleCard";
import Pagination from "../../components/Pagination";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const [search, setSearch] = useState("")
	const timeoutId = useRef()
	
	const searchPlan = (value) => {
		setSearch(value)
		clearTimeout(timeoutId.current)
		timeoutId.current = setTimeout(() => {
			dispatch(getChildList({search: value}))
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
		</div>
	)
}

const ParentPage = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {childList} = useSelector(state => state.parent)
	
	useEffect(() => {
		dispatch(getChildList({}))
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getChildList({page_size: 10, page}))
	}
	
	return (
		<div>
			<TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				<>
					<div className="overflow-x-auto w-full">
						<table className="table w-full">
							<thead>
							<tr className="text-center">
								<th>ID</th>
								<th>Photo</th>
								<th>Full name</th>
								<th>Birthday</th>
								<th>Actions</th>
							</tr>
							</thead>
							<tbody>
							{childList?.data?.map((item) => (
								<tr className="text-center" key={item?.id}>
									<td>{item?.id}</td>
									<td>
										<img className="rounded-full mx-auto w-12 h-12 object-contain" src={item?.profile_picture} alt=""/>
									</td>
									<td>{item?.full_name}</td>
									<td>{item?.birth_day}</td>
									<td className="flex gap-1 justify-center">
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
						totalItems={childList?.pagination?.total_items}
						itemsPerPage={10}
						onPageChange={handlePageChange}
					/>
				</>
			</TitleCard>
		</div>
	);
};

export default ParentPage;