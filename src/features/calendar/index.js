import React, {useEffect, useState} from 'react'
import CalendarView from '../../components/CalendarView'
import moment from 'moment'
import {CALENDAR_INITIAL_EVENTS} from '../../utils/dummyData'
import {useDispatch, useSelector} from 'react-redux'
import {openRightDrawer} from '../common/rightDrawerSlice'
import {MODAL_BODY_TYPES, RIGHT_DRAWER_TYPES} from '../../utils/globalConstantUtil'
import {showNotification} from '../common/headerSlice'
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import Pagination from "../../components/Pagination";
import TitleCard from "../../components/Cards/TitleCard";
import {useNavigate} from "react-router-dom";
import {getEduPlanList} from "./calendarSlice";
import {openModal} from "../common/modalSlice";
import {hasPermission} from "../../auth/jwtService";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import {PencilIcon} from "@heroicons/react/20/solid";
import InputText from "../../components/Input/InputText";


// const INITIAL_EVENTS = CALENDAR_INITIAL_EVENTS

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewPlanModal = () => {
		dispatch(openModal({title: "Add New Plan", bodyType: MODAL_BODY_TYPES.POST_ADD_NEW}))
	}
	
	return (
		<div className="float-right flex items-end gap-2">
			{hasPermission("plan_of_year") && (
				<InputText
					type="text"
					// defaultValue={postObj.title ?? ""}
					updateType="title"
					labelTitle="Search"
					// updateFormValue={updateFormValue}
				/>
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
	
	// const [events, setEvents] = useState(INITIAL_EVENTS)
	//
	// const addNewEvent = (date) => {
	//     let randomEvent = INITIAL_EVENTS[Math.floor(Math.random() * 10)]
	//     let newEventObj = {title : randomEvent.title, theme : randomEvent.theme, startTime : moment(date).startOf('day'), endTime : moment(date).endOf('day')}
	//     setEvents([...events, newEventObj])
	//     dispatch(showNotification({message : "New Event Added!", status : 1}))
	// }
	//
	// // Open all events of current day in sidebar
	// const openDayDetail = ({filteredEvents, title}) => {
	//     dispatch(openRightDrawer({header : title, bodyType : RIGHT_DRAWER_TYPES.CALENDAR_EVENTS, extraObject : {filteredEvents}}))
	// }
	
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
	
	return (
		<>
			{/*<CalendarView */}
			{/*     calendarEvents={events}*/}
			{/*     addNewEvent={addNewEvent}*/}
			{/*     openDayDetail={openDayDetail}*/}
			{/*/>*/}
			
			<TitleCard title="Current Plan of yearly" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
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
										className="btn btn-square btn-error text-white"
										onClick={() => deleteCurrentPlan(item?.id)}
										disabled={!hasPermission("plan_of_year")}
									>
										<TrashIcon className="w-5"/>
									</button>
									<button
										className="btn btn-square btn-warning text-white"
										// onClick={() => openAddNewPostModal(item?.id)}
										disabled={!hasPermission("plan_of_year")}
									>
										<PencilIcon className="w-5"/>
									</button>
									<button
										className="btn btn-square btn-success text-white"
										// onClick={() => openAddNewPostModal(item?.id)}
										disabled={!hasPermission("plan_of_year")}
									>
										<ChevronRightIcon className="w-5"/>
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