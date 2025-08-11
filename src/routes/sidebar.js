/** Icons are imported separatly to reduce build time */
import {
	ChatBubbleBottomCenterTextIcon,
	StarIcon,
	DocumentCheckIcon,
	UserGroupIcon,
	UsersIcon,
	InboxArrowDownIcon,
	Cog6ToothIcon,
	CalendarDaysIcon,
	Squares2X2Icon
} from "@heroicons/react/24/solid";

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [
	
	{
		path: '/app/dashboard',
		icon: <Squares2X2Icon className={iconClasses}/>,
		name: 'Dashboard',
		permission: "dashboard"
	},
	// {
	// 	path: '/app/leads', // url
	// 	icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
	// 	name: 'Leads', // name that appear in Sidebar
	// },
	{
		path: '/app/users',
		icon: <UserGroupIcon className={iconClasses}/>,
		name: "Users",
		permission: "users"
	},
	{
		path: '/app/calendar', // url
		icon: <CalendarDaysIcon className={iconClasses}/>, // icon component
		name: 'Plan of yearly',
		permission: "plan_of_year"
	},
	
	// {
	//   path: '', //no url needed as this has submenu
	//   icon: <RectangleGroupIcon className={`${iconClasses} inline`}/>, // icon component
	//   name: 'Groups', // name that appear in Sidebar
	//   submenu: [
	//     {
	//       path: '/app/groups',
	//       icon: <UsersIcon className={submenuIconClasses}/>,
	//       name: 'Groups',
	//     },
	//   ]
	// },
	
	{
		path: '/app/groups',
		icon: <UsersIcon className={submenuIconClasses}/>,
		name: 'Groups',
		permission: "groups"
	},
	
	{
		path: '/app/roles', //no url needed as this has submenu
		icon: <Cog6ToothIcon className={`${iconClasses} inline`}/>, // icon component
		name: 'Roles',
		permission: "roles"
	},
	
	{
		path: '/app/smm', //no url needed as this has submenu
		icon: <ChatBubbleBottomCenterTextIcon className={`${iconClasses} inline`}/>, // icon component
		name: 'SMM Post',
		permission: "smm_post"
	},
	{
		path: '/app/child', //no url needed as this has submenu
		icon: <StarIcon className={`${iconClasses} inline`}/>, // icon component
		name: 'Child',
		permission: "child"
	},
	{
		path: '/app/check-kids', //no url needed as this has submenu
		icon: <DocumentCheckIcon className={`${iconClasses} inline`}/>, // icon component
		name: 'Check kids',
		permission: "check_kids"
	},
	
	// {
	//   path: '', //no url needed as this has submenu
	//   icon: <DocumentDuplicateIcon className={`${iconClasses} inline` }/>, // icon component
	//   name: 'Pages', // name that appear in Sidebar
	//   submenu : [
	//     {
	//       path: '/login',
	//       icon: <ArrowRightOnRectangleIcon className={submenuIconClasses}/>,
	//       name: 'Login',
	//     },
	//     {
	//       path: '/register', //url
	//       icon: <UserIcon className={submenuIconClasses}/>, // icon component
	//       name: 'Register', // name that appear in Sidebar
	//     },
	//     {
	//       path: '/forgot-password',
	//       icon: <KeyIcon className={submenuIconClasses}/>,
	//       name: 'Forgot Password',
	//     },
	//     {
	//       path: '/app/blank',
	//       icon: <DocumentIcon className={submenuIconClasses}/>,
	//       name: 'Blank Page',
	//     },
	//     {
	//       path: '/app/404',
	//       icon: <ExclamationTriangleIcon className={submenuIconClasses}/>,
	//       name: '404',
	//     },
	//   ]
	// },
	// {
	//   path: '', //no url needed as this has submenu
	//   icon: <Cog6ToothIcon className={`${iconClasses} inline` }/>, // icon component
	//   name: 'Settings', // name that appear in Sidebar
	//   submenu : [
	//     {
	//       path: '/app/settings-profile', //url
	//       icon: <UserIcon className={submenuIconClasses}/>, // icon component
	//       name: 'Profile', // name that appear in Sidebar
	//     },
	//     {
	//       path: '/app/settings-billing',
	//       icon: <WalletIcon className={submenuIconClasses}/>,
	//       name: 'Billing',
	//     },
	//     {
	//       path: '/app/settings-team', // url
	//       icon: <UsersIcon className={submenuIconClasses}/>, // icon component
	//       name: 'Team Members', // name that appear in Sidebar
	//     },
	//   ]
	// },
]

export default routes


