import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {MODAL_BODY_TYPES} from '../../utils/globalConstantUtil'
import Pagination from "../../components/Pagination";
import TitleCard from "../../components/Cards/TitleCard";
import {useNavigate} from "react-router-dom";
import {getEduPlanList} from "./calendarSlice";
import {openModal} from "../common/modalSlice";
import {hasPermission} from "../../auth/jwtService";
import {PencilIcon, TrashIcon, ChevronRightIcon, XCircleIcon} from "@heroicons/react/20/solid";
import InputText from "../../components/Input/InputText";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const [search, setSearch] = useState("")
	const timeoutId = useRef()
	
	const openAddNewPlanModal = () => {
		dispatch(openModal({title: "Add New Plan", bodyType: MODAL_BODY_TYPES.EDU_ADD_NEW}))
	}
	
	const searchPlan = (value) => {
		setSearch(value)
		clearTimeout(timeoutId.current)
		timeoutId.current = setTimeout(() => {
			dispatch(getEduPlanList({search: value}))
		}, 500)
	}
	
	return (
		<div className="flex justify-between items-end gap-2 w-full">
			{hasPermission("plan_of_year") && (
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
							dispatch(getEduPlanList())
						}}
					>
						<XCircleIcon className="w-6"/>
					</button>
				</div>
			)}
			{hasPermission("plan_of_year") && (
				<button
					className="btn px-6 btn-sm normal-case btn-primary"
					onClick={() => openAddNewPlanModal()}
				>
					Add New Plan
				</button>
			)}
		</div>
	)
}

function Calendar() {
	
	const dispatch = useDispatch()
	const navigate = useNavigate()
	
	const {eduPlanList} = useSelector((state) => state.eduPlan)
	
	useEffect(() => {
		dispatch(getEduPlanList())
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getEduPlanList({page_size: 10, page}))
	}
	
	const deleteCurrentPlan = (id) => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this plan?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_PLAN',
				payload: id
			}
		}));
	};
	
	const openAddNewPlanModal = (id) => {
		dispatch(openModal({
			title: "Edit Plan",
			bodyType: MODAL_BODY_TYPES.EDU_ADD_NEW,
			extraObject: {
				notification: 'Successfully edited!',
				id,
				is_edit: true
			}
		}))
	}
	
	return (
		<>
			<TitleCard topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				<div className="overflow-x-auto w-full">
					<table className="table w-full">
						<thead>
						<tr className="text-center">
							<th>ID</th>
							<th>Title</th>
							<th>Description</th>
							<th>Author</th>
							<th>Actions</th>
						</tr>
						</thead>
						<tbody>
						{eduPlanList?.data?.map((item) => (
							<tr className="text-center" key={item?.id}>
								<td>{item?.id}</td>
								<td>{item?.title}</td>
								<td>{item?.description}</td>
								<td>{item?.author?.full_name}</td>
								<td className="flex gap-1 justify-center">
									<button
										className="btn btn-sm btn-error text-white"
										onClick={() => deleteCurrentPlan(item?.id)}
										disabled={!hasPermission("plan_of_year")}
									>
										<TrashIcon className="w-6"/>
									</button>
									<button
										className="btn btn-sm btn-warning text-white"
										onClick={() => openAddNewPlanModal(item?.id)}
										disabled={!hasPermission("plan_of_year")}
									>
										<PencilIcon className="w-6"/>
									</button>
									<button
										className="btn btn-sm btn-success text-white"
										onClick={() => navigate(`${item?.id}`)}
										disabled={!hasPermission("plan_of_year")}
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
					totalItems={eduPlanList?.pagination?.total_items}
					itemsPerPage={10}
					onPageChange={handlePageChange}
				/>
			</TitleCard>
		</>
	)
}

export default Calendar