import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getUserData} from "../../../auth/jwtService";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import SelectBox from "../../../components/Input/SelectBox";

const AddPlanEduModal = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	
	const {loading} = useSelector((state) => state.eduPlan)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const isEditMode = Boolean(extraObject?.is_edit);
	
	const [postObj, setPostObj] = useState({
		title: "",
		author: getUserData()?.id,
		edu_plan: extraObject?.id,
		date_time: "",
		goals: "",
		activities: "",
		groups: [],
		children: [],
		status: ""
	})
	
	useEffect(() => {
		if (!isOpen) {
			setPostObj({
				title: "",
				author: getUserData()?.id,
				edu_plan: extraObject?.id,
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
	};
	
	const statusOptions = [
		{ label: "In progress", value: "IN_PROGRESS" },
		{ label: "Skipped", value: "SKIPPED" },
		{ label: "Done", value: "DONE" },
	];
	
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
				// options={
				// 	children?.map((child) => ({label: child?.full_name, value: Number(child?.id)}))
				// }
				labelTitle="Select group"
				placeholder="Choose group..."
				containerStyle="w-full"
				updateType="groups"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				// defaultValue={
				// 	children
				// 		?.map((teacher) => ({ label: teacher?.full_name, value: Number(teacher?.id) }))
				// 		?.filter(opt => groupObj?.group_children?.includes(opt.value))
				// }
			/>
			
			<SelectBox
				// options={
				// 	children?.map((child) => ({label: child?.full_name, value: Number(child?.id)}))
				// }
				labelTitle="Select children"
				placeholder="Choose children..."
				containerStyle="w-full"
				updateType="children"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				// defaultValue={
				// 	children
				// 		?.map((teacher) => ({ label: teacher?.full_name, value: Number(teacher?.id) }))
				// 		?.filter(opt => groupObj?.group_children?.includes(opt.value))
				// }
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
					// onClick={() => savePost()}
					disabled={loading}
				>
					{loading ? "Loading..." : (isEditMode ? "Update" : "Save")}
				</button>
			</div>
		</div>
	);
};

export default AddPlanEduModal;