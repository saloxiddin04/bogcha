import React, {useEffect} from 'react'

import {UserGroupIcon, UsersIcon, StarIcon, AcademicCapIcon, BellSlashIcon} from '@heroicons/react/24/outline'
import {useDispatch, useSelector} from 'react-redux'
import {
	getGroupsForDashboard,
	getPlanStatusStatistics,
	getUsersAttendance,
	getUsersCount,
	getUsersScore,
	getUsersTemperature,
	getUsersTopByAttendance
} from "./dashboardSlice";
import {
	CategoryScale,
	Chart as ChartJS,
	Filler, Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
	BarElement
} from "chart.js";
import {Bar, Line} from "react-chartjs-2";
import TitleCard from "../../components/Cards/TitleCard";
import moment from "moment";
import Loader from "../../containers/Loader";
import StatsFilter from "./components/StatsFilter";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
	BarElement
);


function Dashboard() {
	
	const dispatch = useDispatch()
	
	const {
		loading,
		usersCount,
		attendanceData,
		usersScore,
		usersTemperature,
		topUsersByAttendance,
		planStatus,
		users,
		groups,
		
		attendanceLoading,
		scoreLoading,
		temperatureLoading,
		planStatusLoading,
	} = useSelector((state) => state.dashboard)
	
	useEffect(() => {
		dispatch(getUsersCount())
		dispatch(getGroupsForDashboard())
		dispatch(getUsersTopByAttendance())
	}, [dispatch])
	
	const colors = [
		"rgb(255, 99, 132)",
		"rgb(54, 162, 235)",
		"rgb(255, 206, 86)",
		"rgb(75, 192, 192)",
		"rgb(153, 102, 255)",
		"rgb(255, 159, 64)",
		"rgb(199, 199, 199)",
		"rgb(26,203,38)",
		"rgb(26,50,203)",
		"rgb(154,93,155)",
	];
	
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
	
	const optionsBar = {
		indexAxis: "y",
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
	
	
	// --------- attendanceData ---------- //
	const allDates = attendanceData?.data?.find((d) => d?.all_date_line)?.all_date_line ?? [];
	const labelsAttendanceData = Array.isArray(allDates) ? allDates.map((date) => moment(date).format("DD.MM.YYYY HH:mm")) : [];
	const dataAttendanceData = {
		labels: labelsAttendanceData,
		datasets: Array.isArray(attendanceData?.data)
			? attendanceData?.data
				.filter((d) => d?.user_data)
				.map((user, idx) => {
					const name = user?.user_data?.full_name || "No name";
					const userDates = user?.user_data?.date_line ?? [];
					
					const color = colors[idx % colors.length];
					
					return {
						label: name,
						data: allDates.map((date) =>
							userDates.includes(date) ? 1 : 0
						),
						borderColor: color,
						backgroundColor: color
					};
				})
			: [],
	};
	
	// --------- usersScore ---------- //
	const allDatesUsersScore = usersScore?.data?.find((d) => d?.all_date_line)?.all_date_line ?? [];
	const labelsUsersScore = Array.isArray(allDatesUsersScore) ? allDatesUsersScore.map((date) => moment(date).format("DD.MM.YYYY HH:mm")) : [];
	const dataUsersScore = {
		labels: labelsUsersScore,
		datasets: Array.isArray(usersScore?.data)
			? usersScore.data
				.filter((d) => d?.user_data)
				.map((user, idx) => {
					const name = user?.user_data?.full_name || "No name";
					const userDates = user?.user_data?.date_line ?? [];
					const userScores = user?.user_data?.score ?? [];
					const color = colors[idx % colors.length];
					
					const dateScoreMap = {};
					userDates.forEach((date, idx) => {
						dateScoreMap[date] =
							(dateScoreMap[date] || 0) + (userScores[idx] ?? 0);
					});
					
					return {
						label: name,
						data: allDatesUsersScore?.map((date) => dateScoreMap[date] || 0),
						borderColor: color,
						backgroundColor: color,
						tension: 0.3,
					};
				})
			: [],
	};
	
	// --------- usersTemperature ---------- //
	const allDatesUsersTemperature = usersTemperature?.data?.find((d) => d?.all_date_line)?.all_date_line ?? [];
	const labelsUsersTemperature = Array.isArray(allDatesUsersTemperature) ? allDatesUsersTemperature.map((date) => moment(date).format("DD.MM.YYYY HH:mm")) : [];
	const dataUsersTemperature = {
		labels: labelsUsersTemperature,
		datasets: Array.isArray(usersTemperature?.data)
			? usersTemperature.data
				.filter((d) => d?.user_data)
				.map((user, idx) => {
					const name = user?.user_data?.full_name || "No name";
					const userDates = user?.user_data?.date_line ?? [];
					const userTemperature = user?.user_data?.temperature ?? [];
					const color = colors[idx % colors.length];
					
					const dateTemperatureMap = {};
					userDates.forEach((date, idx) => {
						dateTemperatureMap[date] =
							(dateTemperatureMap[date] || 0) + (userTemperature[idx] ?? 0);
					});
					
					return {
						label: name,
						data: allDatesUsersTemperature?.map((date) => dateTemperatureMap[date] || 0),
						borderColor: color,
						backgroundColor: color,
						tension: 0.3,
					};
				})
			: [],
	};
	
	// --------- topUsersByAttendance ---------- //
	const dataTopUsersByAttendance = {
		labels: topUsersByAttendance?.data?.map((item) => item?.full_name) || [],
		datasets: [
			{
				label: "Attendance Score",
				data: topUsersByAttendance?.data?.map((user) => user?.score) || [],
				backgroundColor: topUsersByAttendance?.data?.map(
					(_, idx) => colors[idx % colors.length]
				),
				borderColor: topUsersByAttendance?.data?.map(
					(_, idx) => colors[idx % colors.length]
				),
				borderWidth: 1,
			},
		],
	};
	
	// --------- planStatus ---------- //
	const dataPlanStatus = {
		labels: ["Total Plans", "In Progress", "Skipped", "Done"],
		datasets: [
			{
				label: "Plans Status",
				data: [
					planStatus?.data?.total_plans,
					planStatus?.data?.in_progress,
					planStatus?.data?.skipped,
					planStatus?.data?.done,
				],
				backgroundColor: [
					colors[0 % colors.length],
					colors[1 % colors.length],
					colors[2 % colors.length],
					colors[3 % colors.length],
				],
				borderColor: [
					colors[0 % colors.length],
					colors[1 % colors.length],
					colors[2 % colors.length],
					colors[3 % colors.length],
				],
				borderWidth: 1,
			},
		],
	};
	
	return (
		<>
			{/*<DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/>*/}
			
			<div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
				<div className="stats shadow">
					<div className="stat">
						<div className={`stat-figure dark:text-slate-300`}><UserGroupIcon className="w-8 h-8"/></div>
						<div className="stat-title dark:text-slate-300">All users</div>
						<div className={`stat-value dark:text-slate-300`}>{usersCount?.data?.all_users}</div>
					</div>
				</div>
				<div className="stats shadow">
					<div className="stat">
						<div className={`stat-figure dark:text-slate-300`}><UsersIcon className="w-8 h-8"/></div>
						<div className="stat-title dark:text-slate-300">Employee</div>
						<div className={`stat-value dark:text-slate-300`}>{usersCount?.data?.employee}</div>
					</div>
				</div>
				<div className="stats shadow">
					<div className="stat">
						<div className={`stat-figure dark:text-slate-300`}><UsersIcon className="w-8 h-8"/></div>
						<div className="stat-title dark:text-slate-300">Family members</div>
						<div className={`stat-value dark:text-slate-300`}>{usersCount?.data?.family_member}</div>
					</div>
				</div>
				<div className="stats shadow">
					<div className="stat">
						<div className={`stat-figure dark:text-slate-300`}><StarIcon className="w-8 h-8"/></div>
						<div className="stat-title dark:text-slate-300">Children</div>
						<div className={`stat-value dark:text-slate-300`}>{usersCount?.data?.children}</div>
					</div>
				</div>
				<div className="stats shadow">
					<div className="stat">
						<div className={`stat-figure dark:text-slate-300`}><AcademicCapIcon className="w-8 h-8"/></div>
						<div className="stat-title dark:text-slate-300">Teacher</div>
						<div className={`stat-value dark:text-slate-300`}>{usersCount?.data?.teacher}</div>
					</div>
				</div>
				<div className="stats shadow">
					<div className="stat">
						<div className={`stat-figure dark:text-slate-300`}><BellSlashIcon className="w-8 h-8"/></div>
						<div className="stat-title dark:text-slate-300">No active user</div>
						<div className={`stat-value dark:text-slate-300`}>{usersCount?.data?.no_active}</div>
					</div>
				</div>
			</div>
			
			<div className="grid lg:grid-cols-1 mt-4 grid-cols-1 gap-6">
				<TitleCard title={"Attendance data"}>
					<StatsFilter
						fields={["come_or_went", "start_date", "end_date", "person_type", "group_id", "user"]}
						onChange={(filters) => dispatch(getUsersAttendance(filters))}
						groupOptions={groups?.data?.map((el) => ({label: el?.name, value: el?.id}))}
						userOptions={users?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					{attendanceLoading ? <Loader /> : <Line data={dataAttendanceData} options={options}/>}
				</TitleCard>
				<TitleCard title={"Users score"}>
					<StatsFilter
						fields={["group_id", "start_date", "end_date", "user"]}
						onChange={(filters) => dispatch(getUsersScore(filters))}
						groupOptions={groups?.data?.map((el) => ({label: el?.name, value: el?.id}))}
						userOptions={users?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					{scoreLoading ? <Loader /> : <Line data={dataUsersScore} options={options}/>}
				</TitleCard>
			</div>
			
			<div className="grid lg:grid-cols-1 mt-4 grid-cols-1 gap-6">
				<TitleCard title={"Users temperature"}>
					<StatsFilter
						fields={["group_id", "start_date", "end_date", "user"]}
						onChange={(filters) => dispatch(getUsersTemperature(filters))}
						groupOptions={groups?.data?.map((el) => ({label: el?.name, value: el?.id}))}
						userOptions={users?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					{temperatureLoading ? <Loader /> : <Line data={dataUsersTemperature} options={options}/>}
				</TitleCard>
				<TitleCard title={"Top Users By Attendance"}>
					{loading ? <Loader/> : <Bar data={dataTopUsersByAttendance} options={optionsBar}/>}
				</TitleCard>
			</div>
			
			<div className="grid lg:grid-cols-1 mt-4 grid-cols-1 gap-6">
				<TitleCard title={"Plan year of count"}>
					<StatsFilter
						fields={["group_id", "date_time", "user"]}
						onChange={(filters) => dispatch(getPlanStatusStatistics(filters))}
						groupOptions={groups?.data?.map((el) => ({label: el?.name, value: el?.id}))}
						userOptions={users?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					{planStatusLoading ? <Loader/> : <Bar data={dataPlanStatus} options={options}/>}
				</TitleCard>
			</div>
		</>
	)
}

export default Dashboard