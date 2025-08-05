import {CALENDAR_EVENT_STYLE} from "../../components/CalendarView/util"

const THEME_BG = CALENDAR_EVENT_STYLE

function CalendarEventsBodyRightDrawer({filteredEvents}) {
	
	return (
		<>
			{
				filteredEvents.map((e, k) => {
					return <p key={k}
					          className={`grid mt-3 card rounded-box p-3 overflow-hidden text-ellipsis whitespace-nowrap line-clamp-1 ${THEME_BG[e.theme] || ""}`}>
						{e.title}
					</p>
				})
			}
		</>
	)
}

export default CalendarEventsBodyRightDrawer