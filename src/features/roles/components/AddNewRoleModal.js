import {useState} from "react"
import {useDispatch} from "react-redux"
import InputText from '../../../components/Input/InputText'
import ErrorText from '../../../components/Typography/ErrorText'
import {showNotification} from "../../common/headerSlice"

function AddNewRoleModal({closeModal}) {
	const dispatch = useDispatch()
	const [errorMessage, setErrorMessage] = useState("")
	const [roleObj, setRoleObj] = useState({
		name: "",
		is_active: false
	})
	
	
	const saveNewLead = () => {
		if (roleObj.name.trim() === "") return setErrorMessage("Name is required!")
		else {
			dispatch(showNotification({message: "New Role Added!", status: 1}))
			closeModal()
		}
	}
	
	const updateFormValue = ({updateType, value}) => {
		setErrorMessage("")
		setRoleObj({...roleObj, [updateType]: value})
	}
	
	return (
		<>
			
			<InputText type="text" defaultValue={roleObj.name} updateType="name" containerStyle="mt-4"
			           labelTitle="Name" updateFormValue={updateFormValue}/>
			
			<InputText type="checkbox" defaultValue={roleObj.is_active} updateType="is_active" containerStyle="mt-4"
			           labelTitle="Status" updateFormValue={updateFormValue}/>
			
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary px-6" onClick={() => saveNewLead()}>Save</button>
			</div>
		</>
	)
}

export default AddNewRoleModal