import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: true,
	users: null,
	user: null
}

export const getUsers = createAsyncThunk(
	"users/getUsers",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/users/", {params})
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getUser = createAsyncThunk(
	"users/getUser",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get(`/users/user/${params}/`)
			return response.data?.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const createUser = createAsyncThunk(
	"users/createUser",
	async (data, thunkAPI) => {
		try {
			const response = await instance.post("/users/register/", data)
			await thunkAPI.dispatch(getUsers({ page_size: 10, page: 1 }));
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const deleteUser = createAsyncThunk(
	"users/deleteUser",
	async (params, thunkAPI) => {
		try {
			const response = await instance.delete(`/users/${params}/`);
			await thunkAPI.dispatch(getUsers({ page_size: 10, page: 1 }));
			return response;
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const usersSlice = createSlice({
	name: "users",
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(getUsers.pending, (state) => {
				state.loading = true
			})
			.addCase(getUsers.fulfilled, (state, {payload}) => {
				state.users = payload
				state.loading = false
			})
			.addCase(getUsers.rejected, (state) => {
				state.loading = false
				state.users = null
			})
		
		// deleteUser
		builder
			.addCase(deleteUser.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteUser.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteUser.rejected, (state) => {
				state.loading = false
			})
		
		// createUser
		builder
			.addCase(createUser.pending, (state) => {
				state.loading = true
			})
			.addCase(createUser.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createUser.rejected, (state) => {
				state.loading = false
			})
		
		// getUser
		builder
			.addCase(getUser.pending, (state) => {
				state.loading = true
			})
			.addCase(getUser.fulfilled, (state, {payload}) => {
				state.user = payload
				state.loading = false
			})
			.addCase(getUser.rejected, (state) => {
				state.loading = false
			})
	}
})

export default usersSlice.reducer