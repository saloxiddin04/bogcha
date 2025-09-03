import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	usersCount: null,
	attendanceData: null,
	usersScore: null,
	usersTemperature: null,
	topUsersByAttendance: null,
	planStatus: null
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
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/attendance_chart_data/")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersScore = createAsyncThunk(
	"dashboard/getUsersScore",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/user_score_chart_data/")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersTemperature = createAsyncThunk(
	"dashboard/getUsersTemperature",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/user_temperature_chart_data/")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getUsersTopByAttendance = createAsyncThunk(
	"dashboard/getUsersTopByAttendance",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/top_users_by_attendance/")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getPlanStatusStatistics = createAsyncThunk(
	"dashboard/getPlanStatusStatistics",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get("/result/dashboard/plan_status_statistics/")
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
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
				state.loading = true
			})
			.addCase(getUsersAttendance.fulfilled, (state, {payload}) => {
				state.attendanceData = payload
				state.loading = false
			})
			.addCase(getUsersAttendance.rejected, (state) => {
				state.loading = false
			})
		
		// getUsersScore
		builder
			.addCase(getUsersScore.pending, (state) => {
				state.loading = true
			})
			.addCase(getUsersScore.fulfilled, (state, {payload}) => {
				state.usersScore = payload
				state.loading = false
			})
			.addCase(getUsersScore.rejected, (state) => {
				state.loading = false
			})
		
		// getUsersTemperature
		builder
			.addCase(getUsersTemperature.pending, (state) => {
				state.loading = true
			})
			.addCase(getUsersTemperature.fulfilled, (state, {payload}) => {
				state.usersTemperature = payload
				state.loading = false
			})
			.addCase(getUsersTemperature.rejected, (state) => {
				state.loading = false
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
				state.loading = true
			})
			.addCase(getPlanStatusStatistics.fulfilled, (state, {payload}) => {
				state.planStatus = payload
				state.loading = false
			})
			.addCase(getPlanStatusStatistics.rejected, (state) => {
				state.loading = false
			})
	}
})

export default dashboardSlice.reducer