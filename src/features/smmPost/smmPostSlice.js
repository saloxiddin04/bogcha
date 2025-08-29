import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../plugins/axios";

const initialState = {
	loading: false,
	posts: null,
	post: null,
	groups: null,
	parents: null
}

export const getAllPosts = createAsyncThunk(
	"posts/getAllPosts",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/post/", {params})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getPost = createAsyncThunk(
	"posts/getPost",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get(`/post/${params}/`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const createPost = createAsyncThunk(
	"posts/createPost",
	async (params, thunkAPI) => {
		try {
			const response = await instance.post(`/post/`, params)
			await thunkAPI.dispatch(getAllPosts())
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const deletePost = createAsyncThunk(
	"posts/deletePost",
	async (params, thunkAPI) => {
		try {
			const response = await instance.delete(`/post/${params}/`)
			await thunkAPI.dispatch(getAllPosts())
			return response
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const updatePost = createAsyncThunk(
	"posts/updatePost",
	async (params, thunkAPI) => {
		try {
			const response = await instance.patch(`/post/${params?.id}/`, params?.data)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getAllGroupsForPost = createAsyncThunk(
	"posts/getAllGroupsForPost",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get("/post/filter/post_group_list/", {params})
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export const getAllParentsForPost = createAsyncThunk(
	"posts/getAllParentsForPost",
	async (params, thunkAPI) => {
		try {
			const response = await instance.get(`/post/filter/post_family_member/?group_ids=${[params]}`)
			return response.data
		} catch (e) {
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const smmPostSlice = createSlice({
	name: "posts",
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(getAllPosts.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllPosts.fulfilled, (state, {payload}) => {
				state.loading = false
				state.posts = payload
			})
			.addCase(getAllPosts.rejected, (state) => {
				state.loading = false
			})
		
		// getPost
		builder
			.addCase(getPost.pending, (state) => {
				state.loading = true
			})
			.addCase(getPost.fulfilled, (state, {payload}) => {
				state.loading = false
				state.post = payload
			})
			.addCase(getPost.rejected, (state) => {
				state.loading = false
			})
		
		// deletePost
		builder
			.addCase(deletePost.pending, (state) => {
				state.loading = true
			})
			.addCase(deletePost.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deletePost.rejected, (state) => {
				state.loading = false
			})
		
		// createPost
		builder
			.addCase(createPost.pending, (state) => {
				state.loading = true
			})
			.addCase(createPost.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createPost.rejected, (state) => {
				state.loading = false
			})
		
		// updatePost
		builder
			.addCase(updatePost.pending, (state) => {
				state.loading = true
			})
			.addCase(updatePost.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(updatePost.rejected, (state) => {
				state.loading = false
			})
		
		// getAllGroupsForPost
		builder
			.addCase(getAllGroupsForPost.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllGroupsForPost.fulfilled, (state, {payload}) => {
				state.loading = false
				state.groups = payload
			})
			.addCase(getAllGroupsForPost.rejected, (state) => {
				state.loading = false
			})
		
		// getAllParentsForPost
		builder
			.addCase(getAllParentsForPost.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllParentsForPost.fulfilled, (state, {payload}) => {
				state.loading = false
				state.parents = payload
			})
			.addCase(getAllParentsForPost.rejected, (state) => {
				state.loading = false
			})
	}
})

export default smmPostSlice.reducer