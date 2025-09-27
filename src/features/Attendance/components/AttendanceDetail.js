import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import moment from "moment";
import {getAttendance} from "../attendanceSlice";
import {setPageTitle} from "../../common/headerSlice";
import {getUserData} from "../../../auth/jwtService";
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronRightIcon,
	ChevronLeftIcon
} from "@heroicons/react/20/solid";
import {openModal} from "../../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../../utils/globalConstantUtil";

const AttendanceDetail = () => {
	const dispatch = useDispatch();
	const {id: attendance_id} = useParams()
	
	const tableRef = useRef(null);
	
	const {attendance} = useSelector((state) => state.attendance);
	
	const [currentDate, setCurrentDate] = useState(new Date());
	
	const [shouldScrollToCurrentDay, setShouldScrollToCurrentDay] = useState(true);
	
	const daysInMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0
	).getDate();
	
	const daysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);
	
	useEffect(() => {
		dispatch(setPageTitle({title: "Attendance"}))
	}, [dispatch])
	
	useEffect(() => {
		// Get the index of the current date in the daysArray
		if (shouldScrollToCurrentDay) {
			const today = moment().format("D");
			const currentDayIndex = daysArray.indexOf(parseInt(today));
			
			// Scroll to the column of the current day
			if (tableRef.current && currentDayIndex !== -1) {
				const headerCells = tableRef.current.querySelectorAll("thead th");
				const targetCell = headerCells[currentDayIndex + 1]; // +1 to account for the "Name" column
				
				if (targetCell) {
					targetCell.scrollIntoView({behavior: "smooth", inline: "center"});
					setShouldScrollToCurrentDay(false);
				}
			}
		}
	}, [daysArray, shouldScrollToCurrentDay, dispatch, currentDate]);
	
	useEffect(() => {
		setShouldScrollToCurrentDay(true);
	}, [currentDate]);
	
	useEffect(() => {
		if (attendance_id) {
			const data = {
				attendance_id,
				date: moment(currentDate).format("YYYY-MM-DD"),
			};
			dispatch(getAttendance(data));
		}
	}, [dispatch, attendance_id, currentDate]);
	
	// Handle month navigation
	const handleMonthChange = (direction) => {
		setCurrentDate((prevDate) => {
			const newDate = new Date(prevDate);
			newDate.setMonth(newDate.getMonth() + (direction === "prev" ? -1 : 1));
			return newDate;
		});
	};
	
	const handleYearChange = (direction) => {
		setCurrentDate((prevDate) => {
			const newDate = new Date(prevDate);
			newDate.setFullYear(newDate.getFullYear() + (direction === "prev" ? -1 : 1));
			return newDate;
		});
	};
	
	const getMonthYearLabel = () => {
		return currentDate.toLocaleString("default", {
			month: "long",
			year: "numeric",
		});
	};
	
	const openAddNewAttendanceModal = ({ user, date, status, id, is_come }) => {
		dispatch(openModal({
		  title: "Update New Attendance",
		  bodyType: MODAL_BODY_TYPES.ADD_ATTENDANCE_DETAIL_MODAL,
		  extraObject: {
		    is_edit: !!status,
		    id: user.id,
		    full_name: user.full_name,
		    roles: user.roles,
		    status,
		    date: new Date(date),
		    notification: 'Successfully edited!',
			  attendance_id: id,
			  is_come,
			  attendance_group: attendance_id
		  }
		}))
	};
	
	
	return (
		<div className="card">
			<div className="p-4">
				<div className="flex items-center justify-between mb-4">
					<button
						className="btn btn-sm btn-primary text-white"
						onClick={() => setCurrentDate(new Date())}
					>
						Current
					</button>
					<div className="flex items-center gap-2">
						<div className="flex gap-1">
							<button
								onClick={() => handleYearChange("prev")}
								className="btn btn-sm btn-primary text-white"
							>
								<ChevronDoubleLeftIcon className="w-6"/>
							</button>
							<button
								onClick={() => handleMonthChange("prev")}
								className="btn btn-sm btn-primary text-white"
							>
								<ChevronLeftIcon className="w-6"/>
							</button>
						</div>
						<span className="font-medium">{getMonthYearLabel()}</span>
						<div className="flex gap-1">
							<button
								onClick={() => handleMonthChange("next")}
								className="btn btn-sm btn-primary text-white"
							>
								<ChevronRightIcon className="w-6"/>
							</button>
							<button
								onClick={() => handleYearChange("next")}
								className="btn btn-sm btn-primary text-white"
							>
								<ChevronDoubleRightIcon className="w-6"/>
							</button>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table ref={tableRef} className="table-auto w-full border-collapse border border-gray-300">
						<thead>
						<tr>
							<th className="text-xs border border-gray-300 px-4 py-2 sticky left-0 bg-gray-200 text-black">
								Name
							</th>
							{daysArray.map((day) => (
								<th key={day} className="text-xs border border-gray-300 px-2 py-1">
									{day}{" "}
									{currentDate.toLocaleString("default", {
										month: "short",
									})}
								</th>
							))}
						</tr>
						</thead>
						<tbody>
						{attendance?.data?.map((user) => (
							<tr key={user.id}>
								{/* Foydalanuvchi ismi */}
								<td className="text-xs border border-gray-300 px-4 py-2 sticky left-0 bg-white z-10 text-black">
									{user?.full_name}
								</td>
								
								{daysArray.map((day) => {
									const date = moment(currentDate).date(day).format("YYYY-MM-DD");
									
									// Shu kunga tegishli yozuvlarni olish
									const dayAttendances = user?.date_times?.filter(
										(a) => moment(a.date_time).format("YYYY-MM-DD") === date
									);
									
									const comeTime = dayAttendances?.find((a) => a.status === "COME");
									const wontTime = dayAttendances?.find((a) => a.status === "WENT");
									
									const role = getUserData()?.role;
									const isTeacher = role === "teacher";
									const isAdmin = role === "admin";
									const isEditable =
										isAdmin ||
										(isTeacher && moment(currentDate).date(day).isSame(moment(), "day"));
									
									const isCurrentDate = moment().isSame(
										moment(currentDate).date(day),
										"day"
									);
									
									return (
										<td
											key={day}
											className={`border border-gray-300 px-4 py-2 text-xs text-center ${
												isCurrentDate ? "border-2 border-x-blue-500" : ""
											}`}
										>
											<div className="flex items-center justify-center gap-2">
												{/* Kelgan vaqt */}
												{comeTime ? (
													<span
														className="px-2 py-1 rounded bg-green-500 text-white text-xs cursor-pointer"
														onClick={() =>
															openAddNewAttendanceModal({
																user,
																date: comeTime.date_time,
																status: "COME",
																id: comeTime.id,
																is_come: true
															})
														}
													>
												    {moment(comeTime.date_time).format("HH:mm")}
												  </span>
												) : (
													<span
														className="px-2 py-1 rounded border border-gray-300 text-xs whitespace-nowrap cursor-pointer"
														onClick={() =>
															openAddNewAttendanceModal({
																user,
																date,
																status: null,
																id: null,
																is_come: true
															})
														}
													>
												    ------
												  </span>
												)}
												
												{/* Ketgan vaqt */}
												{wontTime ? (
													<span
														className="px-2 py-1 rounded bg-red-500 text-white text-xs cursor-pointer"
														onClick={() =>
															openAddNewAttendanceModal({
																user,
																date: wontTime.date_time,
																status: wontTime.status,
																id: wontTime.id
															})
														}
													>
												    {moment(wontTime.date_time).format("HH:mm")}
												  </span>
												) : (
													<span
														className="px-2 py-1 rounded border border-gray-300 text-xs whitespace-nowrap cursor-pointer"
														onClick={() =>
															openAddNewAttendanceModal({
																user,
																date,
																status: null, // agar ketmagan bo‘lsa default status
																id: null
															})
														}
													>
												    -----
												  </span>
												)}
											</div>
										</td>
									);
								})}
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AttendanceDetail;