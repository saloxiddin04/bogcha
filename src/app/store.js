import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import leadsSlice from '../features/leads/leadSlice'
import usersSlice from "../features/users/usersSlice";
import rolesSlice from "../features/roles/rolesSlice";
import permissionsSlice from "../features/permissions/permissionsSlice";
import groupsSlice from "../features/groups/groupsSlice";
import smmPostSlice from "../features/smmPost/smmPostSlice";
import eduPlanSlice from "../features/calendar/calendarSlice";
import attendanceSlice from "../features/Attendance/attendanceSlice";
import ParentSlice from "../features/Parent/ParentSlice";

const combinedReducer = {
  header : headerSlice,
  rightDrawer : rightDrawerSlice,
  modal : modalSlice,
  lead : leadsSlice,
  users: usersSlice,
  roles: rolesSlice,
  permissions: permissionsSlice,
  groups: groupsSlice,
  posts: smmPostSlice,
  eduPlan: eduPlanSlice,
  attendance: attendanceSlice,
  parent: ParentSlice
}

export default configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})