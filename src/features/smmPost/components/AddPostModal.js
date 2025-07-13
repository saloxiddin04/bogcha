import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getUserData} from "../../../auth/jwtService";
import {createPost, getAllGroupsForPost, getAllParentsForPost, getPost, updatePost} from "../smmPostSlice";
import Loader from "../../../containers/Loader";
import InputText from "../../../components/Input/InputText";
import SelectBox from "../../../components/Input/SelectBox";
import ErrorText from "../../../components/Typography/ErrorText";
import FileUploadInput from "../../../components/Input/FileUploadInput";
import {showNotification} from "../../common/headerSlice";

const AddPostModal = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	
	const {loading, groups, parents} = useSelector((state) => state.posts)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const [postObj, setPostObj] = useState({
		title: "",
		description: "",
		author: getUserData()?.id,
		groups: [],
		users: [],
	})
	
	const [fileInputs, setFileInputs] = useState([
		{ id: Date.now(), files: [] }
	]);
	
	useEffect(() => {
		dispatch(getAllGroupsForPost({page: 1, page_size: 10000}))
	}, [dispatch])
	
	useEffect(() => {
		if (extraObject?.id && extraObject?.is_edit) {
			dispatch(getPost(extraObject?.id)).then(({payload}) => {
				if (payload) {
				
				}
			})
		}
	}, [extraObject, dispatch])
	
	const isEditMode = Boolean(extraObject?.is_edit);
	
	const addFileInput = () => {
		setFileInputs(prev => [...prev, { id: Date.now(), files: [] }]);
	};
	
	const removeFileInput = (id) => {
		setFileInputs(prev => prev.filter(item => item.id !== id));
	};
	
	const updateFormValue = ({updateType, value}) => {
		setErrorMessage("")
		setPostObj({...postObj, [updateType]: value})
	}
	
	const updateSelectBoxValue = ({updateType, value}) => {
		setPostObj(prev => ({
			...prev,
			[updateType]: value
		}));
		if (updateType === "groups") {
			dispatch(getAllParentsForPost(value));
		}
	};
	
	const saveNewPost = () => {
		if (postObj.title.trim() === "") return setErrorMessage("Title is required!");
		if (postObj.description.trim() === "") return setErrorMessage("Description is required!");
		if (postObj.groups.length === 0) return setErrorMessage("Group is required!");
		if (postObj.users.length === 0) return setErrorMessage("Parent is required!");
		if (fileInputs.length === 0) return setErrorMessage("File is required!");
		
		const formData = new FormData()
		formData.append("title", postObj?.title)
		formData.append("description", postObj?.description)
		formData.append("author", postObj?.author)
		postObj?.groups?.forEach((item, index) => (
			formData.append(`groups${index+1}`, item)
		))
		postObj?.users?.forEach((item, index) => (
			formData.append(`users${index+1}`, item)
		))
		fileInputs?.forEach((item, index) => (
			formData.append(`files${index+1}`, item?.files)
		))
		
		const action = isEditMode ? updatePost : createPost
		const params = isEditMode ? {id: extraObject?.id, data: formData} : formData
		
		dispatch(action(params)).then(({payload}) => {
			if (payload?.status_code === 201 || payload?.status_code === 200) {
				dispatch(showNotification({
					message: isEditMode ? "Post updated successfully!" : "New Post added!",
					status: 1
				}));
				closeModal();
			} else {
				dispatch(showNotification({status: 0}));
			}
		});
	}
	
	// if (loading) return <Loader/>
	
	return (
		<div>
			<InputText
				type="text"
				defaultValue={postObj.title ?? ""}
				updateType="title"
				labelTitle="Title"
				updateFormValue={updateFormValue}
			/>
			
			<InputText
				type="text"
				defaultValue={postObj.description ?? ""}
				updateType="description"
				labelTitle="Description"
				updateFormValue={updateFormValue}
			/>
			
			<SelectBox
				options={
					groups?.data?.map((group) => ({label: group?.full_name, value: Number(group?.id)}))
				}
				labelTitle="Select Groups"
				placeholder="Choose groups..."
				containerStyle="w-full"
				updateType="groups"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
					groups?.data
						?.map((group) => ({ label: group?.full_name, value: Number(group?.id) }))
						?.filter(opt => postObj?.groups?.includes(opt.value))
				}
			/>
			
			<SelectBox
				options={
					parents?.data?.map((parent) => ({label: parent?.name, value: Number(parent?.id)}))
				}
				labelTitle="Select Parents"
				placeholder="Choose parents..."
				containerStyle="w-full"
				updateType="users"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
					parents?.data
						?.map((parent) => ({ label: parent?.name, value: Number(parent?.id) }))
						?.filter(opt => postObj?.users?.includes(opt.value))
				}
			/>
			
			{fileInputs.map((item, index) => (
				<div key={item.id} className="flex items-end gap-4 mt-4">
					<FileUploadInput
						labelTitle={`Fayl yuklang ${index + 1}`}
						updateType="files"
						updateFormValue={({ updateType, value }) => {
							setFileInputs(prev =>
								prev.map(f =>
									f.id === item.id ? { ...f, files: value } : f
								)
							);
						}}
						multiple={true}
					/>
					<button
						type="button"
						className="btn btn-success"
						onClick={addFileInput}
					>
						+
					</button>
					{fileInputs.length > 1 && (
						<button
							type="button"
							className="btn btn-error"
							onClick={() => removeFileInput(item.id)}
						>
							-
						</button>
					)}
				</div>
			))}
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary px-6"
				        onClick={() => saveNewPost()}>{isEditMode ? "Update" : "Save"}</button>
			</div>
		</div>
	);
};

export default AddPostModal;