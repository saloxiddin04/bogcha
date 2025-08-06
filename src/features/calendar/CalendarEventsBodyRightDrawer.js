import {CALENDAR_EVENT_STYLE} from "../../components/CalendarView/util"
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {getCalendarDetail} from "./calendarSlice";
import moment from "moment";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import {PencilIcon} from "@heroicons/react/20/solid";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import Loader from "../../containers/Loader";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";

const THEME_BG = CALENDAR_EVENT_STYLE

function CalendarEventsBodyRightDrawer({date, edu_plan_id}) {
	const dispatch = useDispatch()
	
	const {calendarDetail, loading} = useSelector(state => state.eduPlan)
	
	useEffect(() => {
		dispatch(getCalendarDetail({date_time: moment(date).format("DD.MM.YYYY")}))
	}, [dispatch, date])
	
	const deleteCurrentCalendar = (id) => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this plan?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_PLAN_EDU',
				payload: id,
				date: moment(date).format("DD.MM.YYYY")
			}
		}));
	};
	
	const openAddNewEduPlanModal = (id) => {
		dispatch(openModal({
			title: "Add New Edu Plan",
			bodyType: MODAL_BODY_TYPES.EDU_PLAN_ADD_NEW,
			extraObject: {
				id,
				date: moment(date).format("DD.MM.YYYY"),
				edu_plan_id,
				is_edit: true
			}
		}))
	}
	
	if (loading) return <Loader />
	
	return (
		<div>
			{
				calendarDetail?.data?.map((e, k) => {
					return <div key={k}
					          className={`flex justify-between items-center mt-3 rounded-box p-3 overflow-hidden ${THEME_BG[e.status] || ""}`}>
						<p className="text-ellipsis whitespace-nowrap line-clamp-1">
							{e?.title}
						</p>
						<div className="bg-white p-2 flex items-center gap-2">
							<button
								className="btn btn-sm btn-error text-white"
								onClick={() => deleteCurrentCalendar(e?.id)}
								// disabled={!hasPermission("smm_del")}
							>
								<TrashIcon className="w-5"/>
							</button>
							<button
								className="btn btn-sm btn-warning text-white"
								onClick={() => openAddNewEduPlanModal(e?.id)}
								// disabled={!hasPermission("smm_edit")}
							>
								<PencilIcon className="w-5"/>
							</button>
							<button
								className="btn btn-sm btn-success text-white"
								// onClick={() => openAddNewPostModal(item?.id)}
								// disabled={!hasPermission("smm_det")}
							>
								<ChevronRightIcon className="w-5"/>
							</button>
						</div>
					</div>
				})
			}
		</div>
	)
}

export default CalendarEventsBodyRightDrawer