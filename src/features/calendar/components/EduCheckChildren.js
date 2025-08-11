import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import InputText from "../../../components/Input/InputText";
import {getCheckChildrenList, patchCheckChildrenList} from "../calendarSlice";
import ErrorText from "../../../components/Typography/ErrorText";
import {showNotification} from "../../common/headerSlice";

const EduCheckChildren = ({closeModal, extraObject}) => {
	const dispatch = useDispatch()
	const {isOpen} = useSelector((state) => state.modal)
	
	const {loading} = useSelector((state) => state.eduPlan)
	
	const [data, setData] = useState([]);
	const [originalData, setOriginalData] = useState([]);
	
	const [errorMessage, setErrorMessage] = useState("")
	
	useEffect(() => {
		dispatch(getCheckChildrenList({ plan_id: extraObject?.plan_id })).then(({ payload }) => {
			if (payload) {
				setData(payload?.data);
				setOriginalData(payload?.data);
			}
		});
	}, [isOpen, dispatch, extraObject]);
	
	const updateFormValue = ({ value }, i) => {
		setData(prevData =>
			prevData.map((item, index) =>
				index === i
					? { ...item, score: Number(value) }
					: item
			)
		);
	};
	
	const savePost = () => {
		const changedData = data?.filter((item, index) => item.score !== originalData[index].score);
		
		if (changedData.length === 0) {
			setErrorMessage("No changes detected")
			dispatch(showNotification({
				message: "No changes detected",
				status: 0
			}));
			return;
		}
		
		dispatch(patchCheckChildrenList({ data: changedData })).then(({ payload }) => {
			if (payload?.status_code === 201 || payload?.status_code === 200) {
				dispatch(showNotification({
					message: "Check updated successfully!",
					status: 1
				}));
				closeModal();
			} else {
				dispatch(showNotification({ status: 0 }));
			}
		});
	};
	
	return (
		<>
			{data?.map((item, index) => (
				<div className="flex justify-between items-center gap-2 mb-4">
					<InputText
						type="text"
						defaultValue={item.full_name ?? ""}
						updateType="id"
						labelTitle="Full name"
						disabled={true}
					/>
					
					<div className="w-1/4">
						<InputText
							type="text"
							defaultValue={item?.score ?? ""}
							updateType="score"
							labelTitle="Score"
							updateFormValue={(e) => updateFormValue(e, index)}
						/>
					</div>
				</div>
			))}
			
			<ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
			<div className="modal-action">
				<button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
				<button
					className="btn btn-primary px-6"
					onClick={savePost}
					disabled={loading}
				>
					{loading ? "Loading..." : "Save"}
				</button>
			</div>
		</>
	);
};

export default EduCheckChildren;