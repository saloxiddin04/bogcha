import React, {useEffect, useState} from 'react';
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import {useDispatch, useSelector} from "react-redux";
import ToggleInput from "../../../components/Input/ToggleInput";
import SelectBox from "../../../components/Input/SelectBox";
import {getRoles} from "../../roles/rolesSlice";
import {showNotification} from "../../common/headerSlice";
import {createUser} from "../usersSlice";

const AddUserModalBody = ({closeModal}) => {
	const dispatch = useDispatch()
	const {roles} = useSelector((state) => state.roles)
	const {loading} = useSelector((state) => state.users)
	
	const [errorMessage, setErrorMessage] = useState("")
	
	const [userObj, setUserObj] = useState({
		first_name: "",
		last_name: "",
		password: "",
		phone_number: "",
		roles: [],
		birth_day: "",
		status: false
	})
	
	useEffect(() => {
		dispatch(getRoles({page: 1, page_size: 1000}))
	}, [dispatch])
	
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
		if (userObj.first_name.trim() === "") return setErrorMessage("First Name is required!")
		if (userObj.last_name.trim() === "") return setErrorMessage("Last Name is required!")
		if (userObj.password.trim() === "") return setErrorMessage("Password is required!")
		if (userObj.birth_day.trim() === "") return setErrorMessage("Birth day is required!")
		if (userObj.roles.length === 0) return setErrorMessage("Role is required!")
		else {
			dispatch(createUser(userObj)).then(({payload}) => {
				console.log("payload", payload)
			})
			dispatch(showNotification({message: "New Role Added!", status: 1}))
			closeModal()
		}
	}
	
	return (
		<>
			
			<InputText
				type="text"
				defaultValue={userObj.first_name}
				updateType="first_name"
				labelTitle="First name"
				updateFormValue={updateFormValue}
			/>
			<InputText
				type="text"
				defaultValue={userObj.last_name}
				updateType="last_name"
				labelTitle="Last name"
				updateFormValue={updateFormValue}
			/>
			<InputText
				type="text"
				defaultValue={userObj.password}
				updateType="password"
				labelTitle="Password"
				updateFormValue={updateFormValue}
			/>
			<InputText
				type="text"
				defaultValue={userObj.phone_number}
				updateType="phone_number"
				labelTitle="Phone number"
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
			/>
			
			<ToggleInput
				updateType="status" labelTitle="Status" defaultValue={userObj.status}
				updateFormValue={updateFormValue}
				containerStyle={"mt-2"}
			/>
			
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary px-6" onClick={() => saveNewUser()}>Save</button>
			</div>
		</>
	)
};

export default AddUserModalBody;