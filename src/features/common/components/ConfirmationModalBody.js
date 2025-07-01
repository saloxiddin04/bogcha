import {useDispatch} from 'react-redux'
import {showNotification} from '../headerSlice'

function ConfirmationModalBody({extraObject, closeModal, remove}) {
	
	const dispatch = useDispatch()
	
	const {message, notification} = extraObject
	
	
	const proceedWithYes = async () => {
		await remove().then((res) => {
			if (res?.status === 204) {
				dispatch(showNotification({notification, status: 1}))
			} else {
				dispatch(showNotification({notification, status: 0}))
			}
		})
		closeModal()
	}
	
	return (
		<>
			<p className=" text-xl mt-8 text-center">
				{message}
			</p>
			
			<div className="modal-action mt-12">
				<button className="btn btn-outline" onClick={() => closeModal()}>Cancel</button>
				<button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Yes</button>
			</div>
		</>
	)
}

export default ConfirmationModalBody