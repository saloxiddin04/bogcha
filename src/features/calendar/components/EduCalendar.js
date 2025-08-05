import React, {useEffect, useState} from 'react';
import CalendarView from "../../../components/CalendarView";
import moment from "moment/moment";
import {openRightDrawer} from "../../common/rightDrawerSlice";
import {RIGHT_DRAWER_TYPES} from "../../../utils/globalConstantUtil";
import {useDispatch, useSelector} from "react-redux";
import {getCalendarList} from "../calendarSlice";
import {useParams} from "react-router-dom";
import Loader from "../../../containers/Loader";

const EduCalendar = () => {
	const dispatch = useDispatch()
	
	const {loading} = useSelector((state) => state.eduPlan)
	
	const [events, setEvents] = useState([])
	
	const {id} = useParams()
	
	useEffect(() => {
		dispatch(getCalendarList(id))
			.then(({payload}) => {
				const transformed = payload?.data?.map((item) => ({
					title: item?.title,
					theme: item?.status?.toUpperCase(),
					startTime: moment(item?.date_time),
					endTime: moment(new Date()).endOf('day')
				}))
				setEvents(transformed)
			})
			.catch((err) => {
				console.error("Calendar load error:", err)
			})
	}, [dispatch, id])
	
	const openDayDetail = ({date, title}) => {
		console.log(date)
		dispatch(openRightDrawer({
			header: title,
			bodyType: RIGHT_DRAWER_TYPES.CALENDAR_EVENTS,
			extraObject: {date}
		}))
	}
	
	if (loading) return <Loader />
	
	return (
		<div>
			<CalendarView
				calendarEvents={events}
				openDayDetail={openDayDetail}
			/>
		</div>
	);
};

export default EduCalendar;