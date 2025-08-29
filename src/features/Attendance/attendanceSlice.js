import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	attendanceList: null,
	attendanceDetail: null,
	
	attendanceGroup: null,
	attendanceChildren: null,
	loading: false
}

export const getAttendanceList = createAsyncThunk(
	"attendance/getAttendanceList",
	async ({page, page_size, search}, thunkAPI) => {
		try {
			const response = await instance.get('/attendance/', {params: {page, page_size, search}})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getAttendanceDetail = createAsyncThunk(
	"attendance/getAttendanceDetail",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.get(`/attendance/${id}/`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getGroupForAttendance = createAsyncThunk(
	"attendance/getGroupForAttendance",
	async (_, thunkAPI) => {
		try {
			const response = await instance.get('/attendance/check/attendance_filter_groups_list/?page=1&page_size=10000')
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const getChildrenForAttendance = createAsyncThunk(
	"attendance/getChildrenForAttendance",
	async ({group_ids, person_type}, thunkAPI) => {
		try {
			const response = await instance.get('/attendance/check/attendance_children_list/?page=1&page_size=10000', {params: {group_ids, person_type}})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const createAttendance = createAsyncThunk(
	"attendance/createAttendance",
	async (data, thunkAPI) => {
		try {
			const response = await instance.post("/attendance/", data)
			await thunkAPI.dispatch(getAttendanceList({page: 1, page_size: 10}))
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const updateAttendance = createAsyncThunk(
	"attendance/updateAttendance",
	async ({data, id}, thunkAPI) => {
		try {
			const response = await instance.patch(`/attendance/${id}/`, data)
			await thunkAPI.dispatch(getAttendanceList({page: 1, page_size: 10}))
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

export const deleteAttendance = createAsyncThunk(
	"attendance/deleteAttendance",
	async ({id}, thunkAPI) => {
		try {
			const response = await instance.delete(`/attendance/${id}/`)
			await thunkAPI.dispatch(getAttendanceList({page: 1, page_size: 10}))
			return response
		} catch (e) {
			return thunkAPI.rejectWithValue(e.response?.data || e.message)
		}
	}
)

const attendanceSlice = createSlice({
	name: "attendanceSlice",
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(getAttendanceList.pending, (state) => {
				state.loading = true
			})
			.addCase(getAttendanceList.fulfilled, (state, {payload}) => {
				state.attendanceList = payload
				state.loading = false
			})
			.addCase(getAttendanceList.rejected, (state) => {
				state.loading = false
			})
		
		// getAttendanceDetail
		builder
			.addCase(getAttendanceDetail.pending, (state) => {
				state.loading = true
			})
			.addCase(getAttendanceDetail.fulfilled, (state, {payload}) => {
				state.attendanceDetail = payload
				state.loading = false
			})
			.addCase(getAttendanceDetail.rejected, (state) => {
				state.loading = false
			})
		
		// getGroupForAttendance
		builder
			.addCase(getGroupForAttendance.pending, (state) => {
				state.loading = true
			})
			.addCase(getGroupForAttendance.fulfilled, (state, {payload}) => {
				state.attendanceGroup = payload
				state.loading = false
			})
			.addCase(getGroupForAttendance.rejected, (state) => {
				state.loading = false
			})
		
		// getChildrenForAttendance
		builder
			.addCase(getChildrenForAttendance.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildrenForAttendance.fulfilled, (state, {payload}) => {
				state.attendanceChildren = payload
				state.loading = false
			})
			.addCase(getChildrenForAttendance.rejected, (state) => {
				state.loading = false
			})
		
		// createAttendance
		builder
			.addCase(createAttendance.pending, (state) => {
				state.loading = true
			})
			.addCase(createAttendance.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createAttendance.rejected, (state) => {
				state.loading = false
			})
		
		// updateAttendance
		builder
			.addCase(updateAttendance.pending, (state) => {
				state.loading = true
			})
			.addCase(updateAttendance.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateAttendance.rejected, (state) => {
				state.loading = false
			})
		
		// deleteAttendance
		builder
			.addCase(deleteAttendance.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteAttendance.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteAttendance.rejected, (state) => {
				state.loading = false
			})
	}
})

export default attendanceSlice.reducer