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

const AddUserModalBody = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	const {roles, loading: loaderRole} = useSelector((state) => state.roles)
	const {loading} = useSelector((state) => state.users)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const isEditMode = Boolean(extraObject?.is_edit);
	const initialUser = {
		first_name: "",
		last_name: "",
		password: "",
		phone_number: "",
		roles: [],
		birth_day: "",
		status: false
	};
	
	const [userObj, setUserObj] = useState({
		first_name: "",
		last_name: "",
		password: "",
		phone_number: "",
		roles: [],
		birth_day: "",
		status: false
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
						status: payload?.is_active ?? false,
						roles: payload?.roles?.map(role => Number(role.id)) ?? [],
					});
				}
			});
		}
	}, [extraObject?.is_edit, extraObject?.userId, dispatch]);
	
	useEffect(() => {
		dispatch(getRoles({page: 1, page_size: 1000}))
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
	
	const saveNewUser = () => {
		if (userObj.first_name.trim() === "") return setErrorMessage("First Name is required!");
		if (userObj.last_name.trim() === "") return setErrorMessage("Last Name is required!");
		if (!isEditMode && userObj.password.trim() === "") return setErrorMessage("Password is required!");
		if (userObj.birth_day.trim() === "") return setErrorMessage("Birth day is required!");
		if (userObj.roles.length === 0) return setErrorMessage("Role is required!");
		
		const action = isEditMode ? updateUser : createUser;
		const params = isEditMode ? {id: extraObject?.userId, data: userObj} : userObj
		
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
			<SelectBox
				options={roleOptions}
				labelTitle="Select Roles"
				placeholder="Choose roles..."
				containerStyle="w-full"
				updateType="roles"
				updateFormValue={updateSelectBoxValue}
				isMulti={true}
				defaultValue={roleOptions?.filter(opt => userObj.roles?.includes(opt.value))}
			/>
			
			<ToggleInput
				updateType="status" labelTitle="Status" defaultValue={userObj.status ?? false}
				updateFormValue={updateFormValue}
				containerStyle={"mt-2"}
			/>
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary px-6" onClick={() => saveNewUser()}>{isEditMode ? "Update" : "Save"}</button>
			</div>
		</>
	)
};

export default AddUserModalBody;