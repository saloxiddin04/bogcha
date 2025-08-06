import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	eduPlanList: null,
	eduPlanDetail: null,
	calendarList: null,
	calendarDetail: null,
	
	groupsForEdu: null,
	childrenForEdu: null
}

export const getEduPlanList = createAsyncThunk(
	"edu/getEduPlanList",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/edu_plan/", {params})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

export const deleteEduPlanList = createAsyncThunk(
	"edu/deleteEduPlanList",
	async (id, thunkAPI) => {
		try {
			const response = await instance.delete(`/edu_plan/${id}/`)
			await thunkAPI.dispatch(getEduPlanList())
			return response
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

export const createEduPlanList = createAsyncThunk(
	"edu/createEduPlanList",
	async (data, thunkAPI) => {
		try {
			const response = await instance.post("/edu_plan/", data)
			await thunkAPI.dispatch(getEduPlanList())
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

export const updateEduPlanList = createAsyncThunk(
	"edu/updateEduPlanList",
	async (params, thunkAPI) => {
		try {
			const response = await instance.patch(`/edu_plan/${params?.id}`, params?.data)
			await thunkAPI.dispatch(getEduPlanList())
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

// ------------ calendarList ----------- //
export const getCalendarList = createAsyncThunk(
	"edu/getCalendarList",
	async (id, thunkAPI) => {
		try {
			const response = await instance.get(`/edu_plan/plan_get/${id}/plan_list/?page=1&page_size=10000`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

export const createCalendarList = createAsyncThunk(
	"edu/createCalendarList",
	async (data, thunkAPI) => {
		try {
			const response = await instance.post(`/edu_plan/plan/`, data)
			await thunkAPI.dispatch(getCalendarList(data?.edu_plan))
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message);
		}
	}
)

export const getGroupsForEdu = createAsyncThunk(
	"edu/getGroupsForEdu",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/edu_plan/plan_get/plan_groups_list/?page=1&page_size=10000")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getChildrenForEdu = createAsyncThunk(
	"edu/getChildrenForEdu",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/edu_plan/plan_get/children_list/?page=1&page_size=10000", {params})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getCalendarDetail = createAsyncThunk(
	"edu/getCalendarDetail",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/edu_plan/plan_get/plan_detail/?page=1&page_size=10000", {params})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const deleteCalendar = createAsyncThunk(
	"edu/deleteCalendar",
	async (params, thunkAPI) => {
		try {
			const response = await instance.delete(`/edu_plan/plan/${params?.id}/`)
			await thunkAPI.dispatch(getCalendarDetail({date_time: params?.date}))
			return response
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const updateCalendarList = createAsyncThunk(
	"edu/updateCalendarList",
	async (data, thunkAPI) => {
		try {
			const response = await instance.patch(`/edu_plan/plan/${data?.id}/`, data?.data)
			await thunkAPI.dispatch(getCalendarDetail({date_time: data?.date}))
			await thunkAPI.dispatch(getCalendarList(data?.edu_plan))
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

const eduPlanSlice = createSlice({
	name: "edu",
	initialState,
	extraReducers: (builder) => {
		// getEduPlanList
		builder
			.addCase(getEduPlanList.pending, (state) => {
				state.loading = true
			})
			.addCase(getEduPlanList.fulfilled, (state, {payload}) => {
				state.eduPlanList = payload
				state.loading = false
			})
			.addCase(getEduPlanList.rejected, (state) => {
				state.loading = false
			})
		
		// deleteEduPlanList
		builder
			.addCase(deleteEduPlanList.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteEduPlanList.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteEduPlanList.rejected, (state) => {
				state.loading = false
			})
		
		// createEduPlanList
		builder
			.addCase(createEduPlanList.pending, (state) => {
				state.loading = true
			})
			.addCase(createEduPlanList.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createEduPlanList.rejected, (state) => {
				state.loading = false
			})
		
		// updateEduPlanList
		builder
			.addCase(updateEduPlanList.pending, (state) => {
				state.loading = true
			})
			.addCase(updateEduPlanList.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateEduPlanList.rejected, (state) => {
				state.loading = false
			})
		
		// getCalendarList
		builder
			.addCase(getCalendarList.pending, (state) => {
				state.loading = true
			})
			.addCase(getCalendarList.fulfilled, (state, {payload}) => {
				state.calendarList = payload
				state.loading = false
			})
			.addCase(getCalendarList.rejected, (state) => {
				state.loading = false
			})
		
		// createCalendarList
		builder
			.addCase(createCalendarList.pending, (state) => {
				state.loading = true
			})
			.addCase(createCalendarList.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createCalendarList.rejected, (state) => {
				state.loading = false
			})
		
		// getGroupsForEdu
		builder
			.addCase(getGroupsForEdu.fulfilled, (state, {payload}) => {
				state.groupsForEdu = payload
				state.loading = false
			})
			.addCase(getGroupsForEdu.rejected, (state) => {
				state.loading = false
			})
		
		// getChildrenForEdu
		builder
			.addCase(getChildrenForEdu.fulfilled, (state, {payload}) => {
				state.childrenForEdu = payload
				state.loading = false
			})
			.addCase(getChildrenForEdu.rejected, (state) => {
				state.loading = false
			})
		
		// getCalendarDetail
		builder
			.addCase(getCalendarDetail.pending, (state) => {
				state.loading = true
			})
			.addCase(getCalendarDetail.fulfilled, (state, {payload}) => {
				state.calendarDetail = payload
				state.loading = false
			})
			.addCase(getCalendarDetail.rejected, (state) => {
				state.loading = false
			})
		
		// updateCalendarList
		builder
			.addCase(updateCalendarList.pending, (state) => {
				state.loading = true
			})
			.addCase(updateCalendarList.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateCalendarList.rejected, (state) => {
				state.loading = false
			})
	}
})

export default eduPlanSlice.reducer