import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	eduPlanList: null,
	eduPlanDetail: null
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
	}
})

export default eduPlanSlice.reducer