import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	groups: null,
	group: null
}

export const getAllGroups = createAsyncThunk(
	"groups/getAllGroups",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/group/", params)
			return response.data?.data
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
	}
})

export default groupSlice.reducer