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
	
	const {loading, childDetail, temperature} = useSelector((state) => state.parent)
	
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
	
	return (
		<div>
			<TitleCard title={"Child temperature"}>
				<Line data={dataTemperature} options={options}/>
			</TitleCard>
		</div>
	);
};

export default ParentDetail;