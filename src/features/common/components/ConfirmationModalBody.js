import {useDispatch} from 'react-redux'
import {showNotification} from '../headerSlice'
import {useState} from "react";

function ConfirmationModalBody({extraObject, closeModal, remove}) {
	
	const dispatch = useDispatch()
	
	const {message, notification} = extraObject
	
	const [loading, setLoading] = useState(false)
	
	const proceedWithYes = async () => {
		try {
			setLoading(true)
			await remove().then((res) => {
				if (res?.status === 204 || res?.status === 201) {
					dispatch(showNotification({notification, status: 1}))
					setLoading(false)
				} else {
					setLoading(false)
				}
			})
			closeModal()
		} catch (e) {
			setLoading(false)
			return dispatch(showNotification({notification, status: 0}))
		}
	}
	
	return (
		<>
			<p className=" text-xl mt-8 text-center">
				{message}
			</p>
			
			<div className="modal-action mt-12">
				<button className="btn btn-outline" onClick={() => closeModal()}>Cancel</button>
				<button
					className="btn btn-primary w-36"
					onClick={() => proceedWithYes()}
					disabled={loading}
				>
					{loading ? "Loading..." : "Yes"}
				</button>
			</div>
		</>
	)
}

export default ConfirmationModalBody