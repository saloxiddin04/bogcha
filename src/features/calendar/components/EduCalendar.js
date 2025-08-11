import React, {useEffect, useState} from 'react';
import moment from "moment/moment";
import {openRightDrawer} from "../../common/rightDrawerSlice";
import {MODAL_BODY_TYPES, RIGHT_DRAWER_TYPES} from "../../../utils/globalConstantUtil";
import {useDispatch, useSelector} from "react-redux";
import {getCalendarList} from "../calendarSlice";
import {useParams} from "react-router-dom";
import {openModal} from "../../common/modalSlice";
import ChevronLeftIcon from "@heroicons/react/24/solid/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import {CALENDAR_EVENT_STYLE} from "../../../components/CalendarView/util";

const THEME_BG = CALENDAR_EVENT_STYLE


const EduCalendar = () => {
	const dispatch = useDispatch()
	
	const {id} = useParams()
	
	const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
	const colStartClasses = [
		"",
		"col-start-2",
		"col-start-3",
		"col-start-4",
		"col-start-5",
		"col-start-6",
		"col-start-7",
	];
	
	const [firstDayOfMonth, setFirstDayOfMonth] = useState(moment().startOf('month'))
	const [events, setEvents] = useState([])
	
	const [reloadKey, setReloadKey] = useState(0);
	
	const reloadCalendar = () => setReloadKey(prev => prev + 1);
	
	useEffect(() => {
		const year = moment(firstDayOfMonth).format("YYYY");
		const month = moment(firstDayOfMonth).format("MM");
		
		dispatch(getCalendarList({id, year, month}))
			.then(({payload}) => {
				const transformed = payload?.data?.map((item) => ({
					title: item?.title,
					theme: item?.status?.toUpperCase(),
					startTime: moment(item?.date_time),
					endTime: moment(new Date()).endOf('day'),
				}));
				setEvents(transformed);
			})
			.catch((err) => {
				console.error("Calendar load error:", err);
			});
	}, [dispatch, id, firstDayOfMonth, reloadKey]);
	
	const allDaysInMonth = () => {
		let start = moment(firstDayOfMonth).startOf('week')
		let end = moment(moment(firstDayOfMonth).endOf('month')).endOf('week')
		let days = [];
		let day = start;
		while (day <= end) {
			days.push(day.toDate());
			day = day.clone().add(1, 'd');
		}
		return days
	}
	
	const getEventsForCurrentDate = (date) => {
		let filteredEvents = events.filter((e) => {
			return moment(date).isSame(moment(e.startTime), 'day')
		})
		if (filteredEvents.length > 2) {
			let originalLength = filteredEvents.length
			filteredEvents = filteredEvents.slice(0, 2)
			filteredEvents.push({title: `${originalLength - 2} more`, theme: "MORE"})
		}
		return filteredEvents
	}
	
	const openAllEventsDetail = (date) => {
		events.filter((e) => {
			return moment(date).isSame(moment(e.startTime), 'day')
		}).map((e) => {
			return {title: e.title, theme: e.theme, id: e.id, date}
		});
		openDayDetail({date, title: moment(date).format("D MMM YYYY")})
	}
	
	const isToday = (date) => {
		return moment(date).isSame(moment(), 'day');
	}
	
	const isDifferentMonth = (date) => {
		return moment(date).month() !== moment(firstDayOfMonth).month()
	}
	
	const getPrevMonth = () => {
		const firstDayOfPrevMonth = moment(firstDayOfMonth).add(-1, 'M').startOf('month');
		setFirstDayOfMonth(firstDayOfPrevMonth)
	};
	
	const getCurrentMonth = () => {
		const firstDayOfCurrMonth = moment().startOf('month');
		setFirstDayOfMonth(firstDayOfCurrMonth)
	};
	
	const getNextMonth = () => {
		const firstDayOfNextMonth = moment(firstDayOfMonth).add(1, 'M').startOf('month');
		setFirstDayOfMonth(firstDayOfNextMonth)
	};
	
	const openAddNewEduPlanModal = () => {
		dispatch(openModal({
			title: "Add New Edu Plan",
			bodyType: MODAL_BODY_TYPES.EDU_PLAN_ADD_NEW,
			extraObject: {
				edu_plan_id: id,
				reloadCalendar
			}
		}))
	}
	
	const openDayDetail = ({date, title}) => {
		dispatch(openRightDrawer({
			header: title,
			bodyType: RIGHT_DRAWER_TYPES.CALENDAR_EVENTS,
			extraObject: {
				date,
				edu_plan_id: id,
				reloadCalendar
			}
		}))
	}
	
	// if (loading) return <Loader/>
	
	return (
		<div>
			<div className="w-full  bg-base-100 p-4 rounded-lg">
				<div className="flex items-center justify-between">
					<div className="flex  justify-normal gap-2 sm:gap-4">
						<p className="font-semibold text-xl w-48">
							{moment(firstDayOfMonth).format("MMMM yyyy").toString()}
						</p>
						
						<button className="btn  btn-square btn-sm btn-ghost" onClick={getPrevMonth}><ChevronLeftIcon
							className="w-5 h-5"
						
						/></button>
						<button className="btn  btn-sm btn-ghost normal-case" onClick={getCurrentMonth}>
							
							Current Month
						</button>
						<button className="btn btn-square btn-sm btn-ghost" onClick={getNextMonth}><ChevronRightIcon
							className="w-5 h-5"
						
						/></button>
					</div>
					<div>
						<button
							className="btn  btn-sm btn-ghost btn-outline normal-case"
							onClick={openAddNewEduPlanModal}
						>
							Add New Event
						</button>
					</div>
				
				</div>
				<div className="my-4 divider"/>
				<div className="grid grid-cols-7 gap-6 sm:gap-12 place-items-center">
					{weekdays.map((day, key) => {
						return (
							<div className="text-xs capitalize" key={key}>
								{day}
							</div>
						);
					})}
				</div>
				
				
				<div className="grid grid-cols-7 mt-1  place-items-center">
					{allDaysInMonth().map((day, idx) => {
						return (
							<div
								key={idx}
								className={colStartClasses[moment(day).day().toString()] + " border border-solid w-full h-28 cursor-pointer"}
								onClick={() => openAllEventsDetail(day)}
							>
								<p
									className={`flex items-center justify-center h-8 w-8 rounded-full mx-1 mt-1 text-sm hover:bg-base-300 ${isToday(day) && " bg-blue-100 dark:bg-blue-400 dark:hover:bg-base-300 dark:text-white"} ${isDifferentMonth(day) && " text-slate-400 dark:text-slate-600"}`}
								>
									{moment(day).format("D")}
								</p>
								{
									getEventsForCurrentDate(day).map((e, k) => {
										return (
											<p
												key={k}
												className={`text-xs px-2 mt-1 truncate ${THEME_BG[e.theme] || ""}`}
											>
												{e.title}
											</p>
										)
									})
								}
							</div>
						);
					})}
				</div>
			
			
			</div>
		</div>
	);
};

export default EduCalendar;