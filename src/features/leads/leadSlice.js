import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const getLeadsContent = createAsyncThunk('/leads/content', async () => {
	const response = await axios.get('/api/users?page=2', {})
	return response.data;
})

export const leadsSlice = createSlice({
	name: 'leads',
	initialState: {
		isLoading: false,
		leads: []
	},
	reducers: {
		addNewLead: (state, action) => {
			let {newLeadObj} = action.payload
			state.leads = [...state.leads, newLeadObj]
		},
		
		deleteLead: (state, action) => {
			let {index} = action.payload
			state.leads.splice(index, 1)
		}
	},
	extraReducers: builder => {
		builder
			.addCase(getLeadsContent.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getLeadsContent.fulfilled, (state, {payload}) => {
				state.leads = payload
				state.isLoading = false
			})
			.addCase(getLeadsContent.rejected, (state) => {
				state.isLoading = true
			})
	}
})

export const {addNewLead, deleteLead} = leadsSlice.actions

export default leadsSlice.reducer