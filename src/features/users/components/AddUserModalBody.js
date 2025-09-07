import React, {useEffect, useState} from 'react';
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import {useDispatch, useSelector} from "react-redux";
import ToggleInput from "../../../components/Input/ToggleInput";
import SelectBox from "../../../components/Input/SelectBox";
import {getRoles} from "../../roles/rolesSlice";
import {showNotification} from "../../common/headerSlice";
import {clearUserDetail, createUser, getUser, updateUser} from "../usersSlice";
import Loader from "../../../containers/Loader";
import FileUploadInput from "../../../components/Input/FileUploadInput";
import {getAllChildren} from "../../groups/groupsSlice";

const AddUserModalBody = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	const {roles, loading: loaderRole} = useSelector((state) => state.roles)
	const {loading} = useSelector((state) => state.users)
	const {children} = useSelector(state => state.groups)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const isEditMode = Boolean(extraObject?.is_edit);
	const initialUser = {
		first_name: "",
		last_name: "",
		password: "",
		phone_number: "+998",
		roles: [],
		birth_day: "",
		profile_picture: "",
		status: true,
		person_type: "",
		children: [],
		height: "",
		weight: ""
	};
	
	const [userObj, setUserObj] = useState({
		first_name: "",
		last_name: "",
		password: "",
		phone_number: "+998",
		roles: [],
		birth_day: "",
		profile_picture: "",
		status: true,
		person_type: "",
		children: [],
		height: "",
		weight: ""
	});
	
	useEffect(() => {
		if (extraObject?.is_edit && extraObject?.userId) {
			dispatch(getUser(extraObject.userId)).then(({payload}) => {
				if (payload) {
					setUserObj({
						first_name: payload?.first_name ?? "",
						last_name: payload?.last_name ?? "",
						password: undefined,
						phone_number: payload?.phone_number ?? "",
						birth_day: payload?.birth_day ?? "",
						profile_picture: payload?.profile_picture ?? "",
						status: payload?.is_active ?? false,
						roles: payload?.roles?.map(role => Number(role.id)) ?? [],
						children: payload?.children?.map(child => Number(child.id)) ?? [],
						person_type: payload?.person_type ?? "",
						height: payload?.height ?? "",
						weight: payload?.weight ?? "",
					});
				}
			});
		}
	}, [extraObject?.is_edit, extraObject?.userId, dispatch]);
	
	useEffect(() => {
		dispatch(getRoles({page: 1, page_size: 1000}))
		dispatch(getAllChildren({page: 1, page_size: 1000}))
	}, [dispatch])
	
	useEffect(() => {
		if (!isOpen) {
			dispatch(clearUserDetail())
			setUserObj(initialUser);
			setErrorMessage("");
		}
	}, [isOpen]);
	
	const updateFormValue = ({updateType, value}) => {
		setErrorMessage("")
		setUserObj({...userObj, [updateType]: value})
	}
	
	const updateSelectBoxValue = ({updateType, value}) => {
		setUserObj(prev => ({
			...prev,
			[updateType]: value
		}));
	};
	
	const roleOptions = roles?.results
		?.filter(role => role.is_active)
		?.map(role => ({
			label: role.name,
			value: Number(role.id)
		}));
	
	const childrenOptions = children
		?.map(child => ({
			label: child?.full_name,
			value: Number(child?.id)
		}));
	
	const personTypeOptions = [
		{label: "Family member", value: "FAMILY_MEMBER"},
		{label: "Children", value: "CHILDREN"},
		{label: "Employee", value: "EMPLOYEE"},
		{label: "Teacher", value: "TEACHER"}
	]
	
	const saveNewUser = () => {
		if (userObj.first_name.trim() === "") return setErrorMessage("First Name is required!");
		if (userObj.last_name.trim() === "") return setErrorMessage("Last Name is required!");
		if (!isEditMode && userObj.password.trim() === "") return setErrorMessage("Password is required!");
		if (userObj.birth_day.trim() === "") return setErrorMessage("Birth day is required!");
		if (userObj.roles.length === 0) return setErrorMessage("Role is required!");
		if (userObj.person_type.trim() === "") return setErrorMessage("Person type is required!");
		if (userObj.person_type === "FAMILY_MEMBER" && userObj.children.length === 0) return setErrorMessage("Children is required!");
		if (!userObj.profile_picture) return setErrorMessage("Profile picture is required!");
		if (userObj.phone_number.trim() === "") return setErrorMessage("Phone number is required!");
		
		const phoneRegex = /^\+998\d{9}$/;
		if (!userObj.phone_number || !phoneRegex.test(userObj.phone_number)) {
			return setErrorMessage("Phone number must be in format +998901234567");
		}
		
		const formattedBirthDay = userObj?.birth_day
			? userObj?.birth_day?.split("-")?.reverse()?.join(".")
			: "";
		
		const formData = new FormData()
		formData.append("first_name", userObj?.first_name)
		formData.append("last_name", userObj?.last_name)
		formData.append("phone_number", userObj?.phone_number)
		if (!isEditMode) {
			formData.append("password", userObj?.password)
		}
		formData.append("birth_day", formattedBirthDay);
		userObj?.roles?.forEach(role => {
			formData.append("roles", Number(role));
		});
		formData.append("profile_picture", userObj.profile_picture)
		formData.append("status", userObj.status)
		formData.append("person_type", userObj.person_type)
		formData.append("height", userObj.height)
		formData.append("weight", userObj.weight)
		if (userObj.person_type === "FAMILY_MEMBER") {
			userObj?.children?.map((child) => (
				formData.append("children", Number(child))
			))
		}
		
		const action = isEditMode ? updateUser : createUser;
		const params = isEditMode ? {id: extraObject?.userId, data: formData} : formData
		
		dispatch(action(params)).then(({payload}) => {
			if (payload?.status_code === 200) {
				dispatch(showNotification({
					message: isEditMode ? "User updated successfully!" : "New User added!",
					status: 1
				}));
				setUserObj(initialUser)
				closeModal();
			} else {
				dispatch(showNotification({status: 0}));
			}
		});
	};
	
	const handleUpdate = ({updateType, value}) => {
		setUserObj(prev => ({
			...prev,
			[updateType]: value
		}));
	};
	
	if (loading || loaderRole) return <Loader/>
	
	return (
		<>
			
			<InputText
				type="text"
				defaultValue={userObj.first_name ?? ""}
				updateType="first_name"
				labelTitle="First name"
				updateFormValue={updateFormValue}
			/>
			<InputText
				type="text"
				defaultValue={userObj.last_name ?? ""}
				updateType="last_name"
				labelTitle="Last name"
				updateFormValue={updateFormValue}
			/>
			{!isEditMode && (
				<InputText
					type="text"
					defaultValue={userObj.password ?? ""}
					updateType="password"
					labelTitle="Password"
					updateFormValue={updateFormValue}
				/>
			)}
			<InputText
				type="text"
				defaultValue={userObj.phone_number ?? ""}
				updateType="phone_number"
				labelTitle="Phone number"
				updateFormValue={updateFormValue}
			/>
			<InputText
				type="date"
				defaultValue={userObj.birth_day ?? ""}
				updateType="birth_day"
				labelTitle="Birth day"
				updateFormValue={updateFormValue}
			/>
			<FileUploadInput
				labelTitle="Profile picture"
				updateType="profile_picture"
				updateFormValue={handleUpdate}
				multiple={false}
				accept=".pdf,.jpg,.png"
				containerStyle="mt-4"
			/>
			<SelectBox
				options={roleOptions}
				labelTitle="Select Roles"
				placeholder="Choose roles..."
				containerStyle="w-full"
				updateType="roles"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={roleOptions?.filter(opt => userObj?.roles?.includes(opt.value))}
			/>
			
			<ToggleInput
				updateType="status" labelTitle="Status" defaultValue={userObj.status ?? false}
				updateFormValue={updateFormValue}
				containerStyle={"mt-2"}
			/>
			
			<SelectBox
				options={personTypeOptions}
				labelTitle="Select person type"
				placeholder="Choose person type..."
				containerStyle="w-full"
				updateType="person_type"
				updateFormValue={updateSelectBoxValue}
				isMulti={false}
				defaultValue={personTypeOptions?.filter(opt => userObj?.person_type?.includes(opt.value))}
			/>
			
			{userObj.person_type === "FAMILY_MEMBER" && (
				<SelectBox
					options={childrenOptions}
					labelTitle="Select Children"
					placeholder="Choose children..."
					containerStyle="w-full"
					updateType="children"
					updateFormValue={updateSelectBoxValue}
					isMulti={true}
					defaultValue={childrenOptions?.filter(opt => userObj?.children?.includes(opt.value))}
				/>
			)}
			
			{userObj.person_type === "CHILDREN" && (
				<>
					<InputText
						type="text"
						defaultValue={userObj.height ?? ""}
						updateType="height"
						labelTitle="Height"
						updateFormValue={updateFormValue}
					/>
					
					<InputText
						type="text"
						defaultValue={userObj.weight ?? ""}
						updateType="weight"
						labelTitle="Weight"
						updateFormValue={updateFormValue}
					/>
				</>
			)}
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary px-6" onClick={() => saveNewUser()}>{isEditMode ? "Update" : "Save"}</button>
			</div>
		</>
	)
};

export default AddUserModalBody;