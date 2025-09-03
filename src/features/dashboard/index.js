import React, {useEffect, useState} from 'react'
import AmountStats from './components/AmountStats'
import PageStats from './components/PageStats'

import {UserGroupIcon, UsersIcon, StarIcon, AcademicCapIcon, BellSlashIcon} from '@heroicons/react/24/outline'
import UserChannels from './components/UserChannels'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import DashboardTopBar from './components/DashboardTopBar'
import {useDispatch, useSelector} from 'react-redux'
import {showNotification} from '../common/headerSlice'
import DoughnutChart from './components/DoughnutChart'
import {
	getPlanStatusStatistics,
	getUsersAttendance,
	getUsersCount,
	getUsersScore,
	getUsersTemperature,
	getUsersTopByAttendance
} from "./dashboardSlice";


function Dashboard() {
	
	const dispatch = useDispatch()
	
	const {
		loading,
		usersCount,
		attendanceData,
		usersScore,
		usersTemperature,
		topUsersByAttendance,
		planStatus
	} = useSelector((state) => state.dashboard)
	
	useEffect(() => {
		dispatch(getUsersCount())
		dispatch(getUsersAttendance())
		dispatch(getUsersScore())
		dispatch(getUsersTemperature())
		dispatch(getUsersTopByAttendance())
		dispatch(getPlanStatusStatistics())
	}, [dispatch])
	
	const updateDashboardPeriod = (newRange) => {
		// Dashboard range changed, write code to refresh your values
		dispatch(showNotification({message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1}))
	}
	
	return (
		<>
			{/** ---------------------- Select Period Content ------------------------- */}
			<DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/>
			
			{/** ---------------------- Different stats content 1 ------------------------- */}
			<div className="grid lg:grid-cols-6 mt-2 md:grid-cols-2 grid-cols-1 gap-2">
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
				{/*{*/}
				{/*	statsData.map((d, k) => {*/}
				{/*		return (*/}
				{/*			<DashboardStats key={k} {...d} colorIndex={k}/>*/}
				{/*		)*/}
				{/*	})*/}
				{/*}*/}
			</div>
			
			
			{/** ---------------------- Different charts ------------------------- */}
			<div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
				<LineChart/>
				<BarChart/>
			</div>
			
			{/** ---------------------- Different stats content 2 ------------------------- */}
			
			<div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
				<AmountStats/>
				<PageStats/>
			</div>
			
			{/** ---------------------- User source channels table  ------------------------- */}
			
			<div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
				<UserChannels/>
				<DoughnutChart/>
			</div>
		</>
	)
}

export default Dashboard