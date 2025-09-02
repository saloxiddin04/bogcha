import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	childList: null,
	childDetail: null,
	attendanceCome: null,
	attendanceWent: null,
	temperature: null,
	grades: null,
	loading: false
}

export const getChildList = createAsyncThunk(
	"parent/getChildList",
	async ({search, page, page_size}, thunkAPI) => {
		try {
			const response = await instance.get("/result/parent/children_list/", {params: {search, page, page_size}})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getChildDetail = createAsyncThunk(
	"parent/getChildDetail",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/result/parent/${id}/children_data/`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getChildAttendanceCome = createAsyncThunk(
	"parent/getChildAttendanceCome",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/result/parent/${id}/children_attendance_come/`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getChildAttendanceWent = createAsyncThunk(
	"parent/getChildAttendanceWent",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/result/parent/${id}/children_attendance_went/`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getChildTemperature = createAsyncThunk(
	"parent/getChildTemperature",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/result/parent/${id}/children_temperature/`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getChildGrades = createAsyncThunk(
	"parent/getChildGrades",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/result/parent/${id}/children_grades_statistics/`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

const ParentSlice = createSlice({
	name: "parent",
	initialState,
	extraReducers: (builder) => {
		// getChildList
		builder
			.addCase(getChildList.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildList.fulfilled, (state, {payload}) => {
				state.childList = payload
				state.loading = false
			})
			.addCase(getChildList.rejected, (state) => {
				state.loading = false
			})
		
		// getChildDetail
		builder
			.addCase(getChildDetail.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildDetail.fulfilled, (state, {payload}) => {
				state.childDetail = payload
				state.loading = false
			})
			.addCase(getChildDetail.rejected, (state) => {
				state.loading = false
			})
		
		// getChildAttendanceCome
		builder
			.addCase(getChildAttendanceCome.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildAttendanceCome.fulfilled, (state, {payload}) => {
				state.attendanceCome = payload
				state.loading = false
			})
			.addCase(getChildAttendanceCome.rejected, (state) => {
				state.loading = false
			})
		
		// getChildAttendanceWent
		builder
			.addCase(getChildAttendanceWent.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildAttendanceWent.fulfilled, (state, {payload}) => {
				state.attendanceWent = payload
				state.loading = false
			})
			.addCase(getChildAttendanceWent.rejected, (state) => {
				state.loading = false
			})
		
		// getChildTemperature
		builder
			.addCase(getChildTemperature.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildTemperature.fulfilled, (state, {payload}) => {
				state.temperature = payload
				state.loading = false
			})
			.addCase(getChildTemperature.rejected, (state) => {
				state.loading = false
			})
		
		// getChildGrades
		builder
			.addCase(getChildGrades.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildGrades.fulfilled, (state, {payload}) => {
				state.grades = payload
				state.loading = false
			})
			.addCase(getChildGrades.rejected, (state) => {
				state.loading = false
			})
	}
})

export default ParentSlice.reducer