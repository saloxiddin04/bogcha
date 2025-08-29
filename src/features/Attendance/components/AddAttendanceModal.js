import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import InputText from "../../../components/Input/InputText";
import SelectBox from "../../../components/Input/SelectBox";
import ErrorText from "../../../components/Typography/ErrorText";
import {createCalendarList, updateCalendarList} from "../../calendar/calendarSlice";
import {showNotification} from "../../common/headerSlice";
import {createAttendance, getChildrenForAttendance, getGroupForAttendance, updateAttendance} from "../attendanceSlice";

const AddAttendanceModal = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	
	const {loading, attendanceGroup, attendanceChildren} = useSelector((state) => state.attendance)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const isEditMode = Boolean(extraObject?.is_edit);
	
	const [postObj, setPostObj] = useState({
		title: "",
		person_type: "",
		group: "",
		users: []
	})
	
	useEffect(() => {
		if (postObj.person_type && postObj.person_type === "CHILDREN") {
			dispatch(getGroupForAttendance());
		} else if (postObj.person_type !== "CHILDREN") {
			dispatch(getChildrenForAttendance({}));
		}
	}, [dispatch, postObj.person_type]);
	
	const updateFormValue = ({updateType, value}) => {
		setErrorMessage("")
		setPostObj({...postObj, [updateType]: value})
	}
	
	const updateSelectBoxValue = ({updateType, value}) => {
		setPostObj(prev => ({
			...prev,
			[updateType]: value
		}));
		if (updateType === "group") {
			dispatch(getChildrenForAttendance({group_ids: JSON.stringify(value)}))
		}
	};
	
	const savePost = () => {
		if (postObj.title.trim() === "") return setErrorMessage("Title is required!");
		if (postObj.person_type.trim() === "") return setErrorMessage("Person type is required!");
		if (!postObj.users.length) return setErrorMessage("Users is required!");
		
		const action = isEditMode ? updateAttendance : createAttendance
		
		const params = isEditMode ? {id: extraObject?.id, data: postObj} : {...postObj}
		
		dispatch(action(params)).then(({payload}) => {
			if (payload?.status_code === 201 || payload?.status_code === 200) {
				dispatch(showNotification({
					message: isEditMode ? "Attendance updated successfully!" : "New Attendance added!",
					status: 1
				}));
				closeModal();
			} else {
				dispatch(showNotification({status: 0}));
			}
		});
	}
	
	const personTypeOptions = [
		{label: "Family member", value: "FAMILY_MEMBER"},
		{label: "Children", value: "CHILDREN"},
		{label: "Employee", value: "EMPLOYEE"},
		{label: "Teacher", value: "TEACHER"}
	]
	
	return (
		<div>
			<InputText
				type="text"
				defaultValue={postObj.title ?? ""}
				updateType="title"
				labelTitle="Title"
				updateFormValue={updateFormValue}
			/>
			
			<SelectBox
				options={personTypeOptions}
				labelTitle="Select person type"
				placeholder="Choose person type..."
				containerStyle="w-full"
				updateType="person_type"
				updateFormValue={updateSelectBoxValue}
				isMulti={false}
				defaultValue={personTypeOptions?.filter(opt => postObj?.person_type?.includes(opt.value))}
			/>
			
			{postObj.person_type === "CHILDREN" && (
				<SelectBox
					options={
						attendanceGroup?.data?.map((item) => ({label: item?.name, value: Number(item?.id)}))
					}
					labelTitle="Select group"
					placeholder="Choose group..."
					containerStyle="w-full"
					updateType="group"
					updateFormValue={updateSelectBoxValue}
					isMulti={false}
					defaultValue={
						attendanceGroup?.data
							?.map((item) => ({
								label: item?.name,
								value: Number(item?.id)
							}))
							?.find(opt => opt.value === Number(postObj?.group))
					}
				/>
			)}
			
			<SelectBox
				options={
					attendanceChildren?.data?.map((item) => ({label: item?.name, value: Number(item?.id)}))
				}
				labelTitle="Select users"
				placeholder="Choose users..."
				containerStyle="w-full"
				updateType="users"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
					attendanceChildren?.data
						?.map((item) => ({label: item?.name, value: Number(item?.id)}))
						?.filter(opt => postObj?.users?.includes(opt.value))
				}
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

export default AddAttendanceModal;