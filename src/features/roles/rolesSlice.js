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
	}
})

export default rolesSlice.reducer