import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	groups: null,
	group: null,
	teachers: null,
	children: null
}

export const getAllGroups = createAsyncThunk(
	"groups/getAllGroups",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/group/", params)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getGroup = createAsyncThunk(
	"groups/getGroup",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get(`/group/${params}/`)
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getAllTeachers = createAsyncThunk(
	"groups/getAllTeachers",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/group/filter/teachers/", params)
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getAllChildren = createAsyncThunk(
	"groups/getAllChildren",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/group/filter/children/", params)
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const createGroup = createAsyncThunk(
	"groups/createGroup",
	async (data, thunkAPI) => {
		try {
			const response = await instance.post("/group/", data)
			await thunkAPI.dispatch(getAllGroups({ page_size: 10, page: 1 }));
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const deleteGroup = createAsyncThunk(
	"groups/deleteGroup",
	async (id, thunkAPI) => {
		try {
			const response = await instance.delete(`/group/${id}/`);
			await thunkAPI.dispatch(getAllGroups())
			return response
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const updateGroup = createAsyncThunk(
	"groups/updateGroup",
	async (params, thunkAPI) => {
		try {
			const response = await instance.patch(`/group/${params?.id}/`, params?.data);
			await thunkAPI.dispatch(getAllGroups({ page_size: 10, page: 1 }));
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const groupSlice = createSlice({
	name: "groups",
	initialState,
	extraReducers: builder => {
		builder
			.addCase(getAllGroups.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllGroups.fulfilled, (state, {payload}) => {
				state.loading = false
				state.groups = payload
			})
			.addCase(getAllGroups.rejected, (state) => {
				state.loading = false
				state.groups = null
			})
		
		// getGroup
		builder
			.addCase(getGroup.pending, (state) => {
				state.loading = true
			})
			.addCase(getGroup.fulfilled, (state, {payload}) => {
				state.loading = false
				state.group = payload
			})
			.addCase(getGroup.rejected, (state) => {
				state.loading = false
				state.groups = null
			})
		
		// deleteGroup
		builder
			.addCase(deleteGroup.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteGroup.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteGroup.rejected, (state) => {
				state.loading = false
			})
		
		// createGroup
		builder
			.addCase(createGroup.pending, (state) => {
				state.loading = true
			})
			.addCase(createGroup.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createGroup.rejected, (state) => {
				state.loading = false
			})
		
		// getAllTeachers
		builder
			.addCase(getAllTeachers.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllTeachers.fulfilled, (state, {payload}) => {
				state.loading = false
				state.teachers = payload
			})
			.addCase(getAllTeachers.rejected, (state) => {
				state.loading = false
			})
		
		// getAllChildren
		builder
			.addCase(getAllChildren.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllChildren.fulfilled, (state, {payload}) => {
				state.loading = false
				state.children = payload
			})
			.addCase(getAllChildren.rejected, (state) => {
				state.loading = false
			})
		
		// updateGroup
		builder
			.addCase(updateGroup.pending, (state) => {
				state.loading = true
			})
			.addCase(updateGroup.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateGroup.rejected, (state) => {
				state.loading = false
			})
	}
})

export default groupSlice.reducer