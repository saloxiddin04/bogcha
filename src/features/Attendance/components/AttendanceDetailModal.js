import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import InputText from "../../../components/Input/InputText";
import SelectBox from "../../../components/Input/SelectBox";
import ErrorText from "../../../components/Typography/ErrorText";
import {getUserData, hasPermission} from "../../../auth/jwtService";
import {createAttendanceModalDetail, getAttendanceModalDetail, updateAttendanceModalDetail} from "../attendanceSlice";
import moment from "moment/moment";
import {showNotification} from "../../common/headerSlice";
import {TrashIcon} from "@heroicons/react/20/solid";
import {openModal} from "../../common/modalSlice";

const AttendanceDetailModal = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	
	const {loading} = useSelector((state) => state.attendance)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const isEditMode = Boolean(extraObject?.is_edit);
	
	const [postObj, setPostObj] = useState({
		name: "",
		roles: [],
		status: "",
		date_time: "",
		temperature: "",
		description: "",
		user: "",
		author: getUserData()?.id
	})
	
	useEffect(() => {
		if (!isOpen) {
			setPostObj({
				name: "",
				roles: [],
				status: "",
				date_time: "",
				temperature: "",
				description: "",
				user: "",
				author: getUserData()?.id
			});
			setErrorMessage("");
		}
	}, [isOpen, extraObject]);
	
	useEffect(() => {
		if (!extraObject?.status) {
			setPostObj({
				name: extraObject?.full_name ?? "",
				roles: extraObject?.roles ?? [],
				status: "WENT",
				date_time: moment(extraObject?.date).format("YYYY-MM-DDTHH:mm") ?? "",
				temperature: extraObject?.temperature ?? "",
				description: extraObject?.description ?? "",
				user: extraObject?.id ?? "",
				author: getUserData()?.id
			})
		} else {
			dispatch(getAttendanceModalDetail({id: extraObject?.attendance_id})).then(({payload}) => {
				if (payload) {
					setPostObj({
						name: payload?.data?.user?.full_name ?? "",
						roles: payload?.data?.roles?.map((el) => el) ?? [],
						status: payload?.data?.status ?? "WENT",
						date_time: moment(payload?.data?.date_time).format("YYYY-MM-DDTHH:mm") ?? "",
						temperature: payload?.data?.temperature ?? "",
						description: payload?.data?.description ?? "",
						user: payload?.data?.user?.id ?? "",
						author: getUserData()?.id
					})
				}
			})
		}
	}, [extraObject, dispatch])
	
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
	
	const savePost = () => {
		if (postObj.name.trim() === "") return setErrorMessage("Name is required!");
		if (postObj.status.trim() === "") return setErrorMessage("Status is required!");
		if (postObj.date_time.trim() === "") return setErrorMessage("Date time is required!");
		if (!postObj.roles.length) return setErrorMessage("Roles is required!");
		
		const action = isEditMode ? updateAttendanceModalDetail : createAttendanceModalDetail
		const params = isEditMode ?
			{
				id: extraObject?.attendance_id,
				data: postObj,
			} :
			{data: {...postObj, front: true}}
		
		dispatch(action(params)).then(({payload}) => {
			if (payload?.status_code === 201 || payload?.status_code === 200) {
				dispatch(showNotification({
					message: isEditMode ? "Attendance detail updated successfully!" : "New Attendance added!",
					status: 1
				}));
				closeModal();
			} else {
				dispatch(showNotification({status: 0}));
			}
		});
	}
	
	const deleteCurrentAttendanceDetail = () => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this attendance list?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_ATTENDANCE_DETAIL',
				payload: extraObject?.attendance_id
			}
		}));
	};
	
	const statusOptions = [
		{label: "Come", value: "COME"},
		{label: "Went", value: "WENT"},
	]
	
	return (
		<div>
			<InputText
				type="text"
				defaultValue={postObj.name ?? ""}
				updateType="name"
				labelTitle="Name"
				updateFormValue={updateFormValue}
				disabled={postObj.status}
			/>
			
			<SelectBox
				options={
					postObj?.roles?.map((item) => ({label: item, value: item}))
				}
				labelTitle="Select roles"
				placeholder="Choose roles..."
				containerStyle={`w-full ${postObj.status ? "pointer-events-none opacity-25" : ""}`}
				updateType="roles"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
					postObj?.roles
						?.map((item) => ({label: item, value: item}))
						?.filter(opt => postObj?.roles?.includes(opt.value))
				}
				disabled={postObj.status}
			/>
			
			<SelectBox
				options={statusOptions}
				labelTitle="Select status"
				placeholder="Choose status..."
				containerStyle={`w-full ${postObj.status ? "pointer-events-none opacity-25" : ""}`}
				updateType="status"
				updateFormValue={updateSelectBoxValue}
				isMulti={false}
				defaultValue={statusOptions?.find(opt => opt.value === postObj?.status)}
			/>
			
			<InputText
				type="datetime-local"
				defaultValue={postObj.date_time ?? ""}
				updateType="date_time"
				labelTitle="Date time"
				updateFormValue={updateFormValue}
			/>
			
			<InputText
				type="text"
				defaultValue={postObj.temperature ?? ""}
				updateType="temperature"
				labelTitle="Temprature"
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
			<div className="modal-action flex justify-between items-center">
				<button
					className="btn btn-sm btn-error text-white"
					onClick={() => deleteCurrentAttendanceDetail()}
					// disabled={!hasPermission("plan_d_del")}
				>
					<TrashIcon className="w-6"/>
				</button>
				<div className="flex gap-2">
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
		</div>
	);
};

export default AttendanceDetailModal;