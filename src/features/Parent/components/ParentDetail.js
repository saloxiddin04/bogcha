import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {setPageTitle} from "../../common/headerSlice";
import {
	getChildAttendanceCome, getChildAttendanceData,
	getChildAttendanceWent,
	getChildDetail,
	getChildGrades,
	getChildTemperature
} from "../ParentSlice";
import {Line} from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import {
	CategoryScale,
	Chart as ChartJS,
	Filler, Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip
} from "chart.js";
import moment from "moment";
import Loader from "../../../containers/Loader";
import Pagination from "../../../components/Pagination";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend
);

const ParentDetail = () => {
	const dispatch = useDispatch()
	const {id} = useParams()
	
	const {
		loading,
		childDetail,
		temperature,
		grades,
		attendanceWent,
		attendanceCome,
		attendanceData
	} = useSelector((state) => state.parent)
	
	useEffect(() => {
		dispatch(getChildDetail({id}))
		dispatch(getChildAttendanceCome({id}))
		dispatch(getChildAttendanceWent({id}))
		dispatch(getChildTemperature({id}))
		dispatch(getChildGrades({id}))
		dispatch(getChildAttendanceData({id, page: 1, page_size: 10}))
	}, [dispatch, id])
	
	useEffect(() => {
		dispatch(setPageTitle({title: "Parent"}))
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getChildAttendanceData({id, page, page_size: 10}))
	}
	
	const toMinutes = (timeString) => {
		const m = moment(timeString, "HH:mm");
		return m.hours() * 60 + m.minutes();
	};
	
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};
	
	const dataTemperature = {
		labels: temperature?.data?.map((item) => item?.day),
		datasets: [
			{
				label: "Come temperaturasi",
				data: temperature?.data?.map((item) => item?.come_temperature),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				fill: true,
				tension: 0.3,
			},
			{
				label: "Went temperaturasi",
				data: temperature?.data?.map((item) => item?.went_temperature),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				fill: true,
				tension: 0.3,
			},
			{
				label: "Norma pastki chegara",
				data: temperature?.data?.map(() => Number(temperature?.norm.from)),
				borderColor: "rgba(75, 192, 192, 1)",
				borderDash: [5, 5],
				pointRadius: 0,
			},
			{
				label: "Norma yuqori chegara",
				data: temperature?.data?.map(() => Number(temperature?.norm.to)),
				borderColor: "rgba(255, 206, 86, 1)",
				borderDash: [5, 5],
				pointRadius: 0,
			},
		],
	};
	
	const dataGrades = {
		labels: grades?.data?.map((item) => moment(item?.created_date).format("YYYY-MM-DD")),
		datasets: [
			{
				label: "Grades",
				data: grades?.data?.map((item) => item?.score),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				fill: true,
				tension: 0.3,
			},
		]
	}
	
	const dataComeAttendance = {
		labels: attendanceCome?.data?.map((item) => item?.day),
		datasets: [
			{
				label: "Kelgan vaqt",
				data: attendanceCome?.data?.map((item) => toMinutes(moment(item?.come).format("HH-mm"))),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				fill: false,
				tension: 0.3,
			},
			{
				label: "Default vaqt",
				data: attendanceCome?.data?.map(() => toMinutes(attendanceCome?.default?.come)),
				borderColor: "rgba(255, 99, 132, 1)",
				borderDash: [5, 5],
				pointRadius: 0,
			},
		],
	};
	
	const dataWentAttendance = {
		labels: attendanceWent?.data?.map((item) => item?.day),
		datasets: [
			{
				label: "Ketgan vaqt",
				data: attendanceWent?.data?.map((item) => toMinutes(moment(item?.went).format("HH-mm"))),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				fill: false,
				tension: 0.3,
			},
			{
				label: "Default vaqt",
				data: attendanceWent?.data?.map(() => toMinutes(attendanceWent?.default?.went)),
				borderColor: "rgba(255, 99, 132, 1)",
				borderDash: [5, 5],
				pointRadius: 0,
			},
		],
	};
	
	return (
		<div>
			<TitleCard title={"Child detail"}>
				{loading ? <Loader/> :
					<div className="flex flex-col lg:flex-row gap-6">
						<div className="w-full lg:w-1/2 flex flex-col items-center rounded-xl p-4">
							<div className="text-center mb-4">
								<div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
									<img
										className="w-full h-full object-cover"
										src={childDetail?.data?.profile_picture}
										alt="profile_picture"
									/>
								</div>
								<h1 className="text-lg font-semibold mt-2">
									{childDetail?.data?.first_name + " " + childDetail?.data?.last_name}
								</h1>
							</div>
							
							<div className="grid grid-cols-2 gap-4 w-full text-center">
								<div>
									<h2 className="text-sm font-medium text-gray-600">Birth day</h2>
									<span>{childDetail?.data?.birth_day}</span>
								</div>
								<div>
									<h2 className="text-sm font-medium text-gray-600">Height</h2>
									<span>{childDetail?.data?.height}</span>
								</div>
								<div>
									<h2 className="text-sm font-medium text-gray-600">Weight</h2>
									<span>{childDetail?.data?.weight}</span>
								</div>
							</div>
						</div>
						
						<div className="w-full lg:w-1/2 rounded-xl p-4">
							<h1 className="text-lg font-semibold mb-3">Family members</h1>
							<div className="flex flex-col gap-4">
								{childDetail?.data?.family_member?.map((item, index) => (
									<div
										key={index}
										className="rounded-lg p-3"
									>
										<div className="mb-2">
											<h2 className="text-sm font-medium text-gray-600">Full name</h2>
											<span>{item?.full_name}</span>
										</div>
										<div className="mb-2">
											<h2 className="text-sm font-medium text-gray-600">Phone number</h2>
											<span>{item?.phone_number}</span>
										</div>
										<div>
											<h2 className="text-sm font-medium text-gray-600">Role</h2>
											<span>{item?.roles?.join(", ")}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				}
			</TitleCard>
			<div className="flex flex-wrap justify-between gap-2">
				<div className="lg:w-[49%] w-full">
					<TitleCard title={"Child temperature"}>
						{loading ? <Loader/> : <Line data={dataTemperature} options={options}/>}
					</TitleCard>
				</div>
				<div className="lg:w-[49%] w-full">
					<TitleCard title={"Child grades"}>
						{loading ? <Loader/> : <Line data={dataGrades} options={options}/>}
					</TitleCard>
				</div>
				<div className="lg:w-[49%] w-full">
					<TitleCard title={"Child come attendance"}>
						{loading ? <Loader/> :
							<Line
								data={dataComeAttendance}
								options={{
									responsive: true,
									plugins: {
										legend: {position: "top"},
										tooltip: {
											callbacks: {
												label: function (context) {
													const value = context.raw; // bu daqiqalar
													const hours = Math.floor(value / 60);
													const minutes = value % 60;
													const time = `${hours.toString().padStart(2, "0")}:${minutes
														.toString()
														.padStart(2, "0")}`;
													return `${context.dataset.label}: ${time}`;
												},
											},
										},
									},
									scales: {
										y: {
											ticks: {
												callback: (value) => {
													const hours = Math.floor(value / 60);
													const minutes = value % 60;
													return `${hours.toString().padStart(2, "0")}:${minutes
														.toString()
														.padStart(2, "0")}`;
												},
											},
										},
									},
								}}
							/>
						}
					</TitleCard>
				</div>
				<div className="lg:w-[49%] w-full">
					<TitleCard title={"Child went attendance"}>
						{loading ? <Loader/> :
							<Line
								data={dataWentAttendance}
								options={{
									responsive: true,
									plugins: {
										legend: {position: "top"},
										tooltip: {
											callbacks: {
												label: function (context) {
													const value = context.raw;
													const hours = Math.floor(value / 60);
													const minutes = value % 60;
													const time = `${hours.toString().padStart(2, "0")}:${minutes
														.toString()
														.padStart(2, "0")}`;
													return `${context.dataset.label}: ${time}`;
												},
											},
										},
									},
									scales: {
										y: {
											ticks: {
												callback: (value) => {
													const hours = Math.floor(value / 60);
													const minutes = value % 60;
													return `${hours.toString().padStart(2, "0")}:${minutes
														.toString()
														.padStart(2, "0")}`;
												},
											},
										},
									},
								}}
							/>
						}
					</TitleCard>
				</div>
			</div>
			<TitleCard title={"Child Attendance"}>
				<>
					{loading ? <Loader/> :
						<div className="overflow-x-auto w-full">
							<table className="table w-full">
								<thead>
								<tr className="text-center">
									<th>ID</th>
									<th>Date time</th>
									<th>Come or Went</th>
									<th>Temperature</th>
									<th>Description</th>
								</tr>
								</thead>
								<tbody>
								{attendanceData?.data?.map((item) => (
									<tr className="text-center" key={item?.id}>
										<td>{item?.id}</td>
										<td>{moment(item?.date_time).format("YYYY-MM-DD HH:MM")}</td>
										<td>{item?.status}</td>
										<td>{item?.temperature}</td>
										<td>{item?.description}</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
					}
					<Pagination
						totalItems={attendanceData?.pagination?.total_items}
						itemsPerPage={10}
						onPageChange={handlePageChange}
					/>
				</>
			</TitleCard>
		</div>
	);
};

export default ParentDetail;