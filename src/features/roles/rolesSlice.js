import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	roles: null,
	role: null,
	loading: false
}

export const getRoles = createAsyncThunk(
	"roles/getRoles",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/users/role_list/", {params})
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getRole = createAsyncThunk(
	"roles/getRole",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get(`users/role/${params}/`)
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const createRole = createAsyncThunk(
	"roles/createRole",
	async (payload, thunkAPI) => {
		try {
			const response = await instance.post("/users/role_create/", payload)
			await thunkAPI.dispatch(getRoles({page: 1, page_size: 10}))
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const updateRole = createAsyncThunk(
	"roles/updateRole",
	async (payload, thunkAPI) => {
		try {
			const response = await instance.patch(`/users/role_update/${payload?.id}/`, payload?.data)
			await thunkAPI.dispatch(getRoles({page: 1, page_size: 10}))
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const deleteRole = createAsyncThunk(
	"roles/deleteRole",
	async (payload, thunkAPI) => {
		try {
			const response = await instance.delete(`/users/role_delete/${payload}/`)
			await thunkAPI.dispatch(getRoles({page: 1, page_size: 10}))
			return response
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const rolesSlice = createSlice({
	name: "roles",
	initialState,
	extraReducers: builder => {
		builder
			.addCase(getRoles.pending, (state) => {
				state.loading = true
			})
			.addCase(getRoles.fulfilled, (state, {payload}) => {
				state.roles = payload
				state.loading = false
			})
			.addCase(getRoles.rejected, (state) => {
				state.loading = false
			})
		
		// getRole
		builder
			.addCase(getRole.pending, (state) => {
				state.loading = true
			})
			.addCase(getRole.fulfilled, (state, {payload}) => {
				state.loading = false
				state.role = payload
			})
			.addCase(getRole.rejected, (state) => {
				state.loading = false
			})
		
		// createRole
		builder
			.addCase(createRole.pending, (state) => {
				state.loading = true
			})
			.addCase(createRole.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createRole.rejected, (state) => {
				state.loading = false
			})
		
		// updateRole
		builder
			.addCase(updateRole.pending, (state) => {
				state.loading = true
			})
			.addCase(updateRole.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updateRole.rejected, (state) => {
				state.loading = false
			})
		
		// deleteRole
		builder
			.addCase(deleteRole.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteRole.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteRole.rejected, (state) => {
				state.loading = false
			})
	}
})

export default rolesSlice.reducer