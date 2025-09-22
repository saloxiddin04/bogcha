import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	usersCount: null,
	attendanceData: null,
	usersScore: null,
	usersTemperature: null,
	topUsersByAttendance: null,
	planStatus: null,
	groups: null,
	users: null,
	
	attendanceLoading: false,
	scoreLoading: false,
	temperatureLoading: false,
	planStatusLoading: false,
}

export const getUsersCount = createAsyncThunk(
	"dashboard/getUsersCount",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/get_user_counts_by_type/")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersAttendance = createAsyncThunk(
	"dashboard/getUsersAttendance",
	async (filters, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/attendance_chart_data/", {params: filters})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersScore = createAsyncThunk(
	"dashboard/getUsersScore",
	async (filters, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/user_score_chart_data/", {params: filters})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersTemperature = createAsyncThunk(
	"dashboard/getUsersTemperature",
	async (filters, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/user_temperature_chart_data/", {params: filters})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersTopByAttendance = createAsyncThunk(
	"dashboard/getUsersTopByAttendance",
	async (filters, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/top_users_by_attendance/", {params: filters})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getPlanStatusStatistics = createAsyncThunk(
	"dashboard/getPlanStatusStatistics",
	async (filters, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/plan_status_statistics/", {params: filters})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getGroupsForDashboard = createAsyncThunk(
	"dashboard/getGroupsForDashboard",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get('/result/dashboard/attendance_group_list/', {params})
			// const response = await instance.get('/result/dashboard/group_list/', {params})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersForDashboard = createAsyncThunk(
	"dashboard/getUsersForDashboard",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get('/result/dashboard/user_list/', {params})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		clearStates: () => initialState
	},
	extraReducers: (builder) => {
		// getUsersCount
		builder
			.addCase(getUsersCount.pending, (state) => {
				state.loading = true
			})
			.addCase(getUsersCount.fulfilled, (state, {payload}) => {
				state.usersCount = payload
				state.loading = false
			})
			.addCase(getUsersCount.rejected, (state) => {
				state.loading = false
			})
		
		// getUsersAttendance
		builder
			.addCase(getUsersAttendance.pending, (state) => {
				state.attendanceLoading = true
			})
			.addCase(getUsersAttendance.fulfilled, (state, {payload}) => {
				state.attendanceData = payload
				state.attendanceLoading = false
			})
			.addCase(getUsersAttendance.rejected, (state) => {
				state.attendanceLoading = false
			})
		
		// getUsersScore
		builder
			.addCase(getUsersScore.pending, (state) => {
				state.scoreLoading = true
			})
			.addCase(getUsersScore.fulfilled, (state, {payload}) => {
				state.usersScore = payload
				state.scoreLoading = false
			})
			.addCase(getUsersScore.rejected, (state) => {
				state.scoreLoading = false
			})
		
		// getUsersTemperature
		builder
			.addCase(getUsersTemperature.pending, (state) => {
				state.temperatureLoading = true
			})
			.addCase(getUsersTemperature.fulfilled, (state, {payload}) => {
				state.usersTemperature = payload
				state.temperatureLoading = false
			})
			.addCase(getUsersTemperature.rejected, (state) => {
				state.temperatureLoading = false
			})
		
		// getUsersTopByAttendance
		builder
			.addCase(getUsersTopByAttendance.pending, (state) => {
				state.loading = true
			})
			.addCase(getUsersTopByAttendance.fulfilled, (state, {payload}) => {
				state.topUsersByAttendance = payload
				state.loading = false
			})
			.addCase(getUsersTopByAttendance.rejected, (state) => {
				state.loading = false
			})
		
		// getPlanStatusStatistics
		builder
			.addCase(getPlanStatusStatistics.pending, (state) => {
				state.planStatusLoading = true
			})
			.addCase(getPlanStatusStatistics.fulfilled, (state, {payload}) => {
				state.planStatus = payload
				state.planStatusLoading = false
			})
			.addCase(getPlanStatusStatistics.rejected, (state) => {
				state.planStatusLoading = false
			})
		
		// getGroupsForDashboard
		builder
			.addCase(getGroupsForDashboard.pending, (state) => {
				state.loading = true
			})
			.addCase(getGroupsForDashboard.fulfilled, (state, {payload}) => {
				state.groups = payload
				state.loading = false
			})
			.addCase(getGroupsForDashboard.rejected, (state) => {
				state.loading = false
			})
		
		// getUsersForDashboard
		builder
			.addCase(getUsersForDashboard.pending, (state) => {
				state.loading = true
			})
			.addCase(getUsersForDashboard.fulfilled, (state, {payload}) => {
				state.users = payload
				state.loading = false
			})
			.addCase(getUsersForDashboard.rejected, (state) => {
				state.loading = false
			})
	}
})


export const {clearStates} = dashboardSlice.actions
export default dashboardSlice.reducer