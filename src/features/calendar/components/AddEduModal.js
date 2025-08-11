import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getUserData} from "../../../auth/jwtService";
import {showNotification} from "../../common/headerSlice";
import {createEduPlanList, getEduPlanDetail, updateEduPlanList} from "../calendarSlice";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";

const AddEduModal = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	
	const {loading} = useSelector((state) => state.eduPlan)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const isEditMode = Boolean(extraObject?.is_edit);
	
	const [postObj, setPostObj] = useState({
		title: "",
		description: "",
		author: getUserData()?.id,
	})
	
	useEffect(() => {
		if (isEditMode && extraObject?.id) {
			dispatch(getEduPlanDetail({id: extraObject?.id})).then(({payload}) => {
				console.log(payload)
				if (payload?.data) {
					setPostObj({
						title: payload?.data?.title,
						description: payload?.data?.description,
						author: getUserData()?.id,
					})
				}
			})
		}
	}, [extraObject, dispatch, isEditMode])
	
	useEffect(() => {
		if (!isOpen) {
			setPostObj({
				title: "",
				description: "",
				author: getUserData()?.id
			});
			setErrorMessage("");
		}
	}, [isOpen]);
	
	const updateFormValue = ({updateType, value}) => {
		setErrorMessage("")
		setPostObj({...postObj, [updateType]: value})
	}
	
	const savePost = () => {
		if (postObj.title.trim() === "") return setErrorMessage("Title is required!");
		if (postObj.description.trim() === "") return setErrorMessage("Description is required!");
		
		const action = isEditMode ? updateEduPlanList : createEduPlanList
		const params = isEditMode ? {id: extraObject?.id, data: postObj} : postObj
		
		dispatch(action(params)).then(({payload}) => {
			if (payload?.status_code === 201 || payload?.status_code === 200) {
				dispatch(showNotification({
					message: isEditMode ? "Post updated successfully!" : "New Plan added!",
					status: 1
				}));
				closeModal();
			} else {
				dispatch(showNotification({status: 0}));
			}
		});
	}
	
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
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button
					className="btn btn-primary px-6"
					onClick={() => savePost()}
					disabled={loading}
				>
					{loading ? "Loading..." : (isEditMode ? "Update" : "Save")}
				</button>
			</div>
		</div>
	);
};

export default AddEduModal;