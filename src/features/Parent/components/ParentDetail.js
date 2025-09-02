import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {setPageTitle} from "../../common/headerSlice";
import {
	getChildAttendanceCome,
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
		attendanceCome
	} = useSelector((state) => state.parent)
	
	useEffect(() => {
		dispatch(getChildDetail({id}))
		dispatch(getChildAttendanceCome({id}))
		dispatch(getChildAttendanceWent({id}))
		dispatch(getChildTemperature({id}))
		dispatch(getChildGrades({id}))
	}, [dispatch, id])
	
	useEffect(() => {
		dispatch(setPageTitle({title: "Parent"}))
	}, [dispatch])
	
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
				fill: false,
				tension: 0.3,
			},
			{
				label: "Went temperaturasi",
				data: temperature?.data?.map((item) => item?.went_temperature),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				fill: false,
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
			<TitleCard title={"Child temperature"}>
				<Line data={dataTemperature} options={options}/>
			</TitleCard>
			<TitleCard title={"Child grades"}>
				<Line data={dataGrades} options={options}/>
			</TitleCard>
			<TitleCard title={"Child come attendance"}>
				<Line
					data={dataComeAttendance}
					options={{
						responsive: true,
						plugins: {
							legend: { position: "top" },
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
			</TitleCard>
			<TitleCard title={"Child went attendance"}>
				<Line
					data={dataWentAttendance}
					options={{
						responsive: true,
						plugins: {
							legend: { position: "top" },
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
			</TitleCard>
		</div>
	);
};

export default ParentDetail;