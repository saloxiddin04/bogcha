import React, {useEffect} from 'react'

import {UserGroupIcon, UsersIcon, StarIcon, AcademicCapIcon, BellSlashIcon} from '@heroicons/react/24/outline'
import {useDispatch, useSelector} from 'react-redux'
import {
	getGroupsForDashboard, getGroupsForDashboardPlan,
	getPlanStatusStatistics,
	getUsersAttendance,
	getUsersCount, getUsersForDashboardAttendance, getUsersForDashboardScore,
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
	BarElement,
} from "chart.js";
import {Bar, Line} from "react-chartjs-2";
import TitleCard from "../../components/Cards/TitleCard";
import moment from "moment";
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
		usersCount,
		attendanceData,
		usersScore,
		usersTemperature,
		topUsersByAttendance,
		planStatus,
		users,
		groups,
		groupsPlan,
		attendanceUsers,
		scoreUsers
	} = useSelector((state) => state.dashboard)
	
	useEffect(() => {
		dispatch(getUsersCount())
		dispatch(getGroupsForDashboard())
		dispatch(getGroupsForDashboardPlan())
		dispatch(getUsersTopByAttendance())
		dispatch(getUsersForDashboardAttendance())
		dispatch(getUsersForDashboardScore())
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
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
	
	const optionsBar = {
		indexAxis: "y",
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
	
	// --------- attendanceData ---------- //
	const allDates = attendanceData?.data?.find((d) => d?.all_date_line)?.all_date_line ?? [];
	// const labelsAttendanceData = Array.isArray(allDates) ? allDates.map((date) => moment(date).format("DD.MM.YYYY")) : [];
	const uniqueDates = [...new Set(allDates.map(date => date.split('T')[0]))].sort();
	const labelsAttendanceData = Array.isArray(uniqueDates) ? uniqueDates.map((date) => moment(date).format("DD.MM.YYYY")) : [];
	
	// const dataAttendanceData = {
	// 	labels: labelsAttendanceData,
	// 	datasets: Array.isArray(attendanceData?.data)
	// 		? attendanceData?.data
	// 			.filter((d) => d?.user_data)
	// 			.map((user, idx) => {
	// 				const name = user?.user_data?.full_name || "No name";
	// 				const userDates = user?.user_data?.date_line ?? [];
	//
	// 				const color = colors[idx % colors.length];
	//
	// 				return {
	// 					label: name,
	// 					data: allDates.map((date) => userDates.includes(date) ? 1 : 0),
	// 					borderColor: color,
	// 					backgroundColor: color
	// 				};
	// 			})
	// 		: [],
	// };
	
	const allTimes = [];
	attendanceData?.data?.forEach(item => {
		if (item?.user_data?.date_line) {
			item.user_data.date_line.forEach(dateTime => {
				const time = dateTime.split('T')[1].substring(0, 5); // HH:mm formatida
				if (!allTimes.includes(time)) {
					allTimes.push(time);
				}
			});
		}
	});

// Soatlarni tartiblash (06:00, 06:30, 07:00, ...)
	allTimes.sort((a, b) => {
		const [aHours, aMinutes] = a.split(':').map(Number);
		const [bHours, bMinutes] = b.split(':').map(Number);
		return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
	});
	
	if (allTimes.length < 8) {
		const standardTimes = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
		standardTimes.forEach(time => {
			if (!allTimes.includes(time)) {
				allTimes.push(time);
			}
		});
		allTimes.sort((a, b) => {
			const [aHours, aMinutes] = a.split(':').map(Number);
			const [bHours, bMinutes] = b.split(':').map(Number);
			return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
		});
	}
	
	// const dataAttendanceData = {
	// 	labels: labelsAttendanceData,
	// 	datasets: Array.isArray(attendanceData?.data)
	// 		? attendanceData?.data
	// 			.filter((d) => d?.user_data)
	// 			.map((user, idx) => {
	// 				const name = user?.user_data?.full_name || "No name";
	// 				const userDates = user?.user_data?.date_line ?? [];
	//
	// 				const color = colors[idx % colors.length];
	//
	// 				// Har bir sana uchun soat qiymatini olish
	// 				const dataPoints = uniqueDates.map(date => {
	// 					// Ushbu sana uchun xodimning kirish vaqtini topish
	// 					const timeEntry = userDates.find(d => d.startsWith(date));
	// 					if (timeEntry) {
	// 						// Faqat soat:minut qismini olish (HH:mm formatida)
	// 						return timeEntry.split('T')[1].substring(0, 5); // "08:12" formatida
	// 					}
	// 					return null; // Agar kunga kirish bo'lmasa
	// 				});
	//
	// 				return {
	// 					label: name,
	// 					data: dataPoints,
	// 					borderColor: color,
	// 					backgroundColor: color,
	// 					pointRadius: 6,
	// 					pointHoverRadius: 8,
	// 					fill: false
	// 				};
	// 			})
	// 		: [],
	// };
	
	const dataAttendanceData = {
		labels: labelsAttendanceData,
		datasets: Array.isArray(attendanceData?.data)
			? [
				// Foydalanuvchilar datasetlari
				...attendanceData?.data
					.filter((d) => d?.user_data)
					.map((user, idx) => {
						const name = user?.user_data?.full_name || "No name";
						const userDates = user?.user_data?.date_line ?? [];
						
						const color = colors[idx % colors.length];
						
						const dataPoints = uniqueDates.map(date => {
							const timeEntry = userDates.find(d => d.startsWith(date));
							if (timeEntry) {
								return timeEntry.split('T')[1].substring(0, 5);
							}
							return null;
						});
						
						return {
							label: name,
							data: dataPoints,
							borderColor: color,
							backgroundColor: color,
							pointRadius: 6,
							pointHoverRadius: 8,
							fill: false,
						};
					}),
				
				// Default "come" dataset
				{
					label: "Default Come",
					data: uniqueDates.map(() => attendanceData?.default?.come ?? null),
					borderColor: "#4CAF50",
					backgroundColor: "#4CAF50",
					borderDash: [5, 5], // chiziqni punktir qilish
					pointRadius: 0,
					fill: false,
				},
				
				// Default "went" dataset
				{
					label: "Default Went",
					data: uniqueDates.map(() => attendanceData?.default?.went ?? null),
					borderColor: "#F44336",
					backgroundColor: "#F44336",
					borderDash: [5, 5],
					pointRadius: 0,
					fill: false,
				}
			]
			: [],
	};
	
	// --------- usersScore ---------- //
	const allDatesUsersScore = usersScore?.data?.find((d) => d?.all_date_line)?.all_date_line ?? [];
	const labelsUsersScore = Array.isArray(allDatesUsersScore) ? allDatesUsersScore.map((date) => moment(date).format("DD.MM.YYYY")) : [];
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
			? [
				...usersTemperature.data
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
				}),
				
				{
					label: "From",
					data: uniqueDates.map(() => usersTemperature?.norm?.from ?? null),
					borderColor: "#4CAF50",
					backgroundColor: "#4CAF50",
					borderDash: [5, 5], // chiziqni punktir qilish
					pointRadius: 0,
					fill: false,
				},
				
				// Default "went" dataset
				{
					label: "To",
					data: uniqueDates.map(() => usersTemperature?.norm?.to ?? null),
					borderColor: "#F44336",
					backgroundColor: "#F44336",
					borderDash: [5, 5],
					pointRadius: 0,
					fill: false,
				}
			]
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
			
			<div className="grid lg:grid-cols-1 mt-4 grid-cols-1 gap-6 flex-wrap">
				<TitleCard title={"Attendance data"}>
					<StatsFilter
						fields={["come_or_went", "start_date", "end_date", "person_type", "group_id", "user"]}
						onChange={(filters) => dispatch(getUsersAttendance(filters))}
						groupOptions={groups?.data?.map((el) => ({label: el?.title, value: el?.id}))}
						userOptions={attendanceUsers?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					<div className="w-full h-72"><Line data={dataAttendanceData} options={{
						responsive: true,
						maintainAspectRatio: false,
						scales: {
							y: {
								type: 'category',
								labels: allTimes,
								reverse: false
							},
						},
						plugins: {
							tooltip: {
								callbacks: {
									label: function(context) {
										const value = context.raw;
										if (value === null) return `${context.dataset.label}: Kirish yo'q`;
										return `${context.dataset.label}: ${value}`;
									}
								}
							},
							legend: {
								position: 'top',
							},
						}
					}}/></div>
				</TitleCard>
				<TitleCard title={"Users score"}>
					<StatsFilter
						fields={["group_id", "start_date", "end_date", "user"]}
						onChange={(filters) => dispatch(getUsersScore(filters))}
						groupOptions={groupsPlan?.data?.map((el) => ({label: el?.title, value: el?.id}))}
						userOptions={scoreUsers?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					<div className="w-full h-72"><Line data={dataUsersScore} options={options}/></div>
				</TitleCard>
			</div>
			
			<div className="grid lg:grid-cols-1 mt-4 grid-cols-1 gap-6">
				<TitleCard title={"Users temperature"}>
					<StatsFilter
						fields={["come_or_went" ,"group_id", "start_date", "end_date", "user"]}
						onChange={(filters) => dispatch(getUsersTemperature(filters))}
						groupOptions={groups?.data?.map((el) => ({label: el?.title, value: el?.id}))}
						userOptions={users?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					<div className="w-full h-72"><Line data={dataUsersTemperature} options={options}/></div>
				</TitleCard>
				<TitleCard title={"Top Users By Attendance"}>
					<div className="w-full h-72"><Bar data={dataTopUsersByAttendance} options={optionsBar}/></div>
				</TitleCard>
			</div>
			
			<div className="grid lg:grid-cols-1 mt-4 grid-cols-1 gap-6">
				<TitleCard title={"Plan year of count"}>
					<StatsFilter
						fields={["group_id", "date_time", "user"]}
						onChange={(filters) => dispatch(getPlanStatusStatistics(filters))}
						groupOptions={groupsPlan?.data?.map((el) => ({label: el?.title, value: el?.id}))}
						userOptions={users?.data?.map((el) => ({label: el?.full_name, value: el?.id}))}
					/>
					<div className="w-full h-72"><Bar data={dataPlanStatus} options={options}/></div>
				</TitleCard>
			</div>
		</>
	)
}

export default Dashboard