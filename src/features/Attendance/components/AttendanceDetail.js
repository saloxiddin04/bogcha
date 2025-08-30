import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useParams} from "react-router-dom";
import moment from "moment";
import {getAttendance} from "../attendanceSlice";
import {setPageTitle} from "../../common/headerSlice";
import {getUserData} from "../../../auth/jwtService";
import {ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronRightIcon, ChevronLeftIcon} from "@heroicons/react/20/solid";

const AttendanceDetail = () => {
	const dispatch = useDispatch();
	const {id} = useParams()
	const {state} = useLocation()
	
	const tableRef = useRef(null);
	
	const { loading, attendance } = useSelector((state) => state.attendance);
	
	const [currentDate, setCurrentDate] = useState(new Date());
	
	const [shouldScrollToCurrentDay, setShouldScrollToCurrentDay] = useState(true);
	
	const daysInMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0
	).getDate();
	
	const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
	
	useEffect(() => {
		dispatch(setPageTitle({ title : "Attendance"}))
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
		if (id) {
			const data = {
				attendance_id: id,
				date: moment(currentDate).format("YYYY-MM-DD"),
			};
			dispatch(getAttendance(data));
		}
	}, [dispatch, id, currentDate]);
	
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
								<td className="text-xs border border-gray-300 px-4 py-2 sticky left-0 bg-white z-10">
									{user.name}
								</td>
								{daysArray.map((day, index) => {
									const date = moment(currentDate)
										.date(day)
										.format("YYYY-MM-DD");
									const existAttendance = user.attendance.find(
										(a) => moment(a.date).format("YYYY-MM-DD") === date
									);
									
									const role = getUserData()?.role;
									const isTeacher = role === "teacher";
									const isAdmin = role === "admin";
									const isEditable =
										isAdmin ||
										(isTeacher && moment(currentDate).date(day).isSame(moment(), "day"));
									
									const isCurrentDate = moment().isSame(moment(currentDate).date(day), "day");
									
									return (
										<td
											key={day}
											className={`border border-gray-300 px-4 py-2 text-xs ${!isEditable ? 'bg-gray-100' : ''} ${isCurrentDate ? 'border-2 border-x-blue-500' : ''}`}
										>
											<select
												value={existAttendance?.status || ""}
												// onChange={(e) =>
												// 	handleChange(
												// 		e,
												// 		existAttendance,
												// 		user?.id,
												// 		date,
												// 		existAttendance?.id
												// 	)
												// }
												disabled={!isEditable}
												className={`focus:outline-none disabled:opacity-25 p-2 border border-gray-300 rounded ${
													existAttendance?.status
														? existAttendance?.status === "was"
															? "bg-green-500 text-white"
															: "bg-red-500 text-white"
														: ""
												}`}
											>
												<option value="">--</option>
												<option value="was">Was</option>
												<option value="not">Not</option>
											</select>
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