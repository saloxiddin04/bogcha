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
			const response = await instance.get("/v1/users/", params)
			return response.data
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
	}
})

export default usersSlice.reducer