import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	permissions: null,
	permission: {}
}

export const getAllPermissions = createAsyncThunk(
	"permissions/getAllPermissions",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get(`/users/permission_module/${params}/`)
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getChildPermissions = createAsyncThunk(
	'permissions/getChildPermissions',
	async ({ roleId, parentId }, thunkAPI) => {
		try {
			const response = await instance.get(`/users/permission_module/${roleId}/?parent_id=${parentId}`);
			return {
				parentId,
				results: response.data?.data?.results || [],
			};
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
);

export const updatePermission = createAsyncThunk(
	"permissions/updatePermission",
	async (data, thunkAPI) => {
		try {
			return await instance.patch("/users/update_permission_module/", data)
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const permissionsSlice = createSlice({
	name: "permissions",
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(getAllPermissions.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllPermissions.fulfilled, (state, {payload}) => {
				state.loading = false
				state.permissions = payload
			})
			.addCase(getAllPermissions.rejected, (state) => {
				state.loading = false
			})
		
		// getChildPermissions
		builder
			.addCase(getChildPermissions.pending, (state) => {
				state.loading = true
			})
			.addCase(getChildPermissions.fulfilled, (state, {payload}) => {
				const { parentId, results } = payload;
				state.loading = false;
				
				if (!state.permission) state.permission = {};
				state.permission[parentId] = results;
			})
			.addCase(getChildPermissions.rejected, (state) => {
				state.loading = false
			})
	}
})

export default permissionsSlice.reducer