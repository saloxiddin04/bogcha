import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import {showNotification} from "../../common/headerSlice"
import ToggleInput from "../../../components/Input/ToggleInput";
import {createRole, getRole, updateRole} from "../rolesSlice";
import Loader from "../../../containers/Loader";

function AddNewRoleModal({closeModal, extraObject}) {
	const dispatch = useDispatch()
	const {loading} = useSelector(state => state.roles)
	
	const [errorMessage, setErrorMessage] = useState("")
	const [roleObj, setRoleObj] = useState({
		name: "",
		is_active: false
	})
	
	useEffect(() => {
		if (extraObject?.is_edit && extraObject?.id) {
			dispatch(getRole(extraObject?.id)).then(({payload}) => {
				if (payload) {
					setRoleObj({
						name: payload.name ?? "",
						is_active: payload.is_active ?? false
					})
				}
			})
		}
	}, [dispatch, extraObject])
	
	const saveNewLead = () => {
		if (roleObj.name.trim() === "") return setErrorMessage("Name is required!")
		else {
			const action = extraObject?.is_edit ? updateRole : createRole
			const params = extraObject?.is_edit ? {id: extraObject?.id, data: {...roleObj}} : {...roleObj}
			
			dispatch(action(params)).then(({payload}) => {
				if (payload?.id) {
					dispatch(showNotification({message: extraObject?.is_edit ? "Role updated" : "New Role Added!", status: 1}))
					closeModal()
				} else {
					dispatch(showNotification({status: 0}))
				}
			})
		}
	}
	
	const updateFormValue = ({updateType, value}) => {
		setErrorMessage("")
		setRoleObj({...roleObj, [updateType]: value})
	}
	
	if (loading) return <Loader/>
	
	return (
		<>
			
			<InputText
				type="text"
				defaultValue={roleObj.name}
				updateType="name"
				containerStyle="mt-4"
				labelTitle="Name"
				updateFormValue={updateFormValue}
			/>
			
			<ToggleInput
				updateType="is_active"
				labelTitle="Status"
				defaultValue={roleObj.is_active}
				updateFormValue={updateFormValue}
				containerStyle={"mt-2"}
			/>
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
			</div>
		</>
	)
}

export default AddNewRoleModal