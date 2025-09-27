import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import InputText from "../../../components/Input/InputText";
import SelectBox from "../../../components/Input/SelectBox";
import ErrorText from "../../../components/Typography/ErrorText";
import {createGroup, getAllChildren, getAllTeachers, getGroup, updateGroup} from "../groupsSlice";
import {showNotification} from "../../common/headerSlice";
import Loader from "../../../containers/Loader";

const AddGroupModal = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	
	const {isOpen} = useSelector((state) => state.modal)
	const {loading, teachers, children} = useSelector((state) => state.groups)
	
	const [selectedChildren, setSelectedChildren] = useState([]);
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const [groupObj, setGroupObj] = useState({
		name: "",
		teachers: [],
		group_children: []
	})
	
	useEffect(() => {
		dispatch(getAllTeachers({page: 1, page_size: 10000}))
		dispatch(getAllChildren({page: 1, page_size: 10000}))
	}, [dispatch])
	
	useEffect(() => {
		if (!isOpen) {
			setGroupObj({
				name: "",
				teachers: [],
				group_children: []
			});
			setErrorMessage("");
		}
	}, [isOpen, extraObject]);
	
	useEffect(() => {
		if (extraObject?.is_edit && extraObject?.id) {
			dispatch(getGroup(extraObject?.id)).then(({payload}) => {
				if (payload) {
					setGroupObj({
						name: payload?.name ?? "",
						group_children: payload?.group_children ?? [],
						teachers: payload?.teachers?.map((teacher) => Number(teacher?.id)) ?? [],
					})
					
					setSelectedChildren(
						payload?.group_children?.map((el) => ({
							label: el?.full_name,
							value: Number(el?.id),
						})) ?? []
					);
				}
			})
		}
	}, [extraObject, dispatch])
	
	const isEditMode = Boolean(extraObject?.is_edit);
	
	const updateFormValue = ({updateType, value}) => {
		setErrorMessage("")
		setGroupObj({...groupObj, [updateType]: value})
	}
	
	const updateSelectBoxValue = ({updateType, value}) => {
		setGroupObj(prev => ({
			...prev,
			[updateType]: value
		}));
	};
	
	const saveNewGroup = () => {
		if (groupObj.name.trim() === "") return setErrorMessage("Group Name is required!");
		if (groupObj.group_children.length === 0) return setErrorMessage("Children is required!");
		if (groupObj.teachers.length === 0) return setErrorMessage("Teacher is required!");
		
		const action = isEditMode ? updateGroup : createGroup
		const params = isEditMode ? {
			id: extraObject?.id,
			data: {...groupObj,
				group_children: groupObj.group_children?.map(el =>
					typeof el === "object" ? Number(el.id) : Number(el)
				) ?? []
			}
		} : groupObj
		
		dispatch(action(params)).then(({payload}) => {
			if (payload?.status_code === 201 || payload?.status_code === 200) {
				dispatch(showNotification({
					message: isEditMode ? "Group updated successfully!" : "New Group added!",
					status: 1
				}));
				setGroupObj({
					name: "",
					group_children: [],
					teachers: []
				})
				closeModal();
			}
		});
	}
	
	if (loading) return <Loader/>
	
	return (
		<div>
			<InputText
				type="text"
				defaultValue={groupObj.name ?? ""}
				updateType="name"
				labelTitle="Group name"
				updateFormValue={updateFormValue}
			/>
			
			<SelectBox
				options={
					teachers?.map((teacher) => ({label: teacher?.full_name, value: Number(teacher?.id)}))
				}
				labelTitle="Select Teachers"
				placeholder="Choose teachers..."
				containerStyle="w-full"
				updateType="teachers"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
				teachers
					?.map((teacher) => ({ label: teacher?.full_name, value: Number(teacher?.id) }))
					?.filter(opt => groupObj?.teachers?.includes(opt.value))
				}
			/>
			
			<SelectBox
				options={
				// isEditMode ?
					// groupObj?.group_children?.map((child) => ({label: child?.full_name, value: Number(child?.id)}))
					// :
					children?.map((child) => ({label: child?.full_name, value: Number(child?.id)}))
				}
				labelTitle="Select children"
				placeholder="Choose children..."
				containerStyle="w-full"
				updateType="group_children"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={
				isEditMode ?
					groupObj?.group_children?.map((el) => ({
						label: el?.full_name,
						value: Number(el?.id),
					}))
					:
					children?.map((child) => ({label: child?.full_name, value: Number(child?.id)}))
				}
				
				value={selectedChildren}
				onChange={(newValue) => {
					setSelectedChildren(newValue);
					updateSelectBoxValue({
						updateType: "group_children",
						value: newValue?.map((opt) => opt.value),
					});
				}}
			/>
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary px-6"
				        onClick={() => saveNewGroup()}>{isEditMode ? "Update" : "Save"}</button>
			</div>
		</div>
	);
};

export default AddGroupModal;