// All components mapping with path for internal routes

import {lazy} from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Charts = lazy(() => import('../pages/protected/Charts'))
const Integration = lazy(() => import('../pages/protected/Integration'))
const Team = lazy(() => import('../pages/protected/Team'))
const Transactions = lazy(() => import('../pages/protected/Transactions'))
const Bills = lazy(() => import('../pages/protected/Bills'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const Users = lazy(() => import("../pages/protected/Users"))
const Groups = lazy(() => import("../pages/protected/Groups"))
const Roles = lazy(() => import("../pages/protected/Roles"))
const Permissions = lazy(() => import("../pages/protected/Permissions"))

const SmmPost = lazy(() => import("../pages/protected/SmmPost"))

// calendar
const Calendar = lazy(() => import('../pages/protected/Calendar'))
const CalendarDetail = lazy(() => import('../features/calendar/components/EduCalendar'))

// attendance
const Attendance = lazy(() => import("../pages/protected/Attendance"))
const AttendanceDetail = lazy(() => import("../features/Attendance/components/AttendanceDetail"))

// parent
const Parent = lazy(() => import("../pages/protected/Parent"))
const ParentDetail = lazy(() => import("../features/Parent/components/ParentDetail"))

const routes = [
	{
		path: '/dashboard', // the url
		component: Dashboard, // view rendered
	},
	{
		path: '/welcome', // the url
		component: Welcome, // view rendered
	},
	// {
	//   path: '/leads',
	//   component: Leads,
	// },
	{
		path: "/users",
		component: Users
	},
	{
		path: "/groups",
		component: Groups
	},
	{
		path: "/roles",
		component: Roles
	},
	
	// smm post
	{
		path: "/smm",
		component: SmmPost
	},
	
	// Permissions
	{
		path: "/roles/:id",
		component: Permissions
	},
	
	{
		path: '/settings-team',
		component: Team,
	},
	
	// ------- calendar ------ //
	{
		path: '/calendar',
		component: Calendar,
	},
	{
		path: '/calendar/:id',
		component: CalendarDetail,
	},
	
	// ------- Attendance --------- //
	{
		path: "/attendance",
		component: Attendance
	},
	{
		path: "/attendance/:id",
		component: AttendanceDetail
	},
	
	// ------- Parent --------- //
	{
		path: "/parent",
    component: Parent
	},
	{
		path: "/parent/:id",
    component: ParentDetail
	},
	
	{
		path: '/transactions',
		component: Transactions,
	},
	{
		path: '/settings-profile',
		component: ProfileSettings,
	},
	{
		path: '/settings-billing',
		component: Bills,
	},
	{
		path: '/integration',
		component: Integration,
	},
	{
		path: '/charts',
		component: Charts,
	},
	{
		path: '/404',
		component: Page404,
	},
	{
		path: '/blank',
		component: Blank,
	},
]

export default routes
