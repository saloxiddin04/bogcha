import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getUserData} from "../../../auth/jwtService";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import SelectBox from "../../../components/Input/SelectBox";
import {createCalendarList, getChildrenForEdu, getGroupsForEdu, updateCalendarList} from "../calendarSlice";
import {showNotification} from "../../common/headerSlice";
import {useParams} from "react-router-dom";

const AddPlanEduModal = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	
	const {loading, groupsForEdu, childrenForEdu} = useSelector((state) => state.eduPlan)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const isEditMode = Boolean(extraObject?.is_edit);
	
	console.log(extraObject)
	
	const [postObj, setPostObj] = useState({
		title: "",
		author: getUserData()?.id,
		edu_plan: Number(extraObject?.edu_plan_id),
		date_time: "",
		goals: "",
		activities: "",
		groups: [],
		children: [],
		status: ""
	})
	
	useEffect(() => {
		dispatch(getGroupsForEdu())
	}, [dispatch])
	
	useEffect(() => {
		if (!isOpen) {
			setPostObj({
				title: "",
				author: getUserData()?.id,
				edu_plan: Number(extraObject?.edu_plan_id),
				date_time: "",
				goals: "",
				activities: "",
				groups: [],
				children: [],
				status: ""
			});
			setErrorMessage("");
		}
	}, [isOpen, extraObject]);
	
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
			dispatch(getChildrenForEdu({group_ids: JSON.stringify(value)}))
		}
	};
	
	const statusOptions = [
		{label: "In progress", value: "IN_PROGRESS"},
		{label: "Skipped", value: "SKIPPED"},
		{label: "Done", value: "DONE"},
	];
	
	const savePost = () => {
		if (postObj.title.trim() === "") return setErrorMessage("Title is required!");
		if (postObj.date_time.trim() === "") return setErrorMessage("Date time is required!");
		if (postObj.goals.trim() === "") return setErrorMessage("Goals is required!");
		if (postObj.activities.trim() === "") return setErrorMessage("Activities is required!");
		if (!postObj.groups.length) return setErrorMessage("Groups is required!");
		if (!postObj.children) return setErrorMessage("Children is required!");
		if (postObj.status.trim() === "") return setErrorMessage("Status is required!");
		
		const action = isEditMode ? updateCalendarList : createCalendarList
		const params = isEditMode ?
			{
				id: extraObject?.id,
				data: postObj,
				date: extraObject?.date,
				edu_plan: Number(extraObject?.edu_plan_id)
			} :
			{...postObj, date_time: new Date(postObj.date_time).toISOString()}
		
		dispatch(action(params)).then(({payload}) => {
			if (payload?.status_code === 201 || payload?.status_code === 200) {
				dispatch(showNotification({
					message: isEditMode ? "Plan updated successfully!" : "New Edu Plan added!",
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
				type="date"
				defaultValue={postObj.date_time ?? ""}
				updateType="date_time"
				labelTitle="Date time"
				updateFormValue={updateFormValue}
			/>
			
			<InputText
				type="text"
				defaultValue={postObj.goals ?? ""}
				updateType="goals"
				labelTitle="Goals"
				updateFormValue={updateFormValue}
			/>
			<InputText
				type="text"
				defaultValue={postObj.activities ?? ""}
				updateType="activities"
				labelTitle="Activities"
				updateFormValue={updateFormValue}
			/>
			
			<SelectBox
				options={
					groupsForEdu?.data?.map((item) => ({label: item?.name, value: Number(item?.id)}))
				}
				labelTitle="Select group"
				placeholder="Choose group..."
				containerStyle="w-full"
				updateType="groups"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
					groupsForEdu?.data
						?.map((item) => ({label: item?.name, value: Number(item?.id)}))
						?.filter(opt => postObj?.groups?.includes(opt.value))
				}
			/>
			
			<SelectBox
				options={
					childrenForEdu?.data?.map((child) => ({label: child?.full_name, value: Number(child?.id)}))
				}
				labelTitle="Select children"
				placeholder="Choose children..."
				containerStyle="w-full"
				updateType="children"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
					childrenForEdu?.data
						?.map((item) => ({label: item?.full_name, value: Number(item?.id)}))
						?.filter(opt => postObj?.children?.includes(opt.value))
				}
			/>
			
			<SelectBox
				options={statusOptions}
				labelTitle="Select status"
				placeholder="Choose status..."
				containerStyle="w-full"
				updateType="status"
				updateFormValue={updateSelectBoxValue}
				isMulti={false}
				defaultValue={statusOptions.find(option => option.value === postObj.status) || ""}
			/>
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button
					className="btn btn-primary px-6"
					onClick={savePost}
					disabled={loading}
				>
					{loading ? "Loading..." : (isEditMode ? "Update" : "Save")}
				</button>
			</div>
		</div>
	);
};

export default AddPlanEduModal;