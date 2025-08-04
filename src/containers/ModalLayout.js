import {MODAL_BODY_TYPES} from '../utils/globalConstantUtil'
import {useSelector, useDispatch} from 'react-redux'
import {closeModal} from '../features/common/modalSlice'
import AddLeadModalBody from '../features/leads/components/AddLeadModalBody'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'
import AddUserModalBody from "../features/users/components/AddUserModalBody";
import AddNewRoleModal from "../features/roles/components/AddNewRoleModal";
import {deleteUser} from "../features/users/usersSlice";
import {deleteRole} from "../features/roles/rolesSlice";
import AddGroupModal from "../features/groups/components/AddGroupModal";
import {deleteGroup} from "../features/groups/groupsSlice";
import AddPostModal from "../features/smmPost/components/AddPostModal";
import {deletePost} from "../features/smmPost/smmPostSlice";
import {deleteEduPlanList} from "../features/calendar/calendarSlice";
import AddEduModal from "../features/calendar/components/AddEduModal";

function ModalLayout() {
	const { isOpen, bodyType, size, extraObject, title } = useSelector(state => state.modal);
	const dispatch = useDispatch();
	
	const close = (e) => dispatch(closeModal(e));
	
	const ACTION_HANDLERS = {
		DELETE_USER: (params) => dispatch(deleteUser(params)).then(({payload}) => {
			return payload
		}),
		DELETE_ROLE: (params) => dispatch(deleteRole(params)).then(({payload}) => {
			return payload;
		}),
		DELETE_GROUP: (params) => dispatch(deleteGroup(params)).then(({payload}) => {
			return payload;
		}),
		DELETE_POST: (params) => dispatch(deletePost(params)).then(({payload}) => {
			return payload;
		}),
		DELETE_PLAN: (params) => dispatch(deleteEduPlanList(params)).then(({payload}) => {
			return payload;
		}),
	};
	
	const remove = () => {
		const handler = ACTION_HANDLERS[extraObject?.actionKey];
		if (handler) return handler(extraObject?.payload);
	};
	
	return (
		<>
			<div className={`modal ${isOpen ? "modal-open" : ""}`}>
				<div className={`modal-box ${size === 'lg' ? 'max-w-5xl' : ''}`}>
					<button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={close}>✕</button>
					<h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>
					
					{
						{
							[MODAL_BODY_TYPES.LEAD_ADD_NEW]: <AddLeadModalBody closeModal={close} extraObject={extraObject} />,
							[MODAL_BODY_TYPES.USER_ADD_NEW]: <AddUserModalBody closeModal={close} extraObject={extraObject} />,
							[MODAL_BODY_TYPES.ROLE_ADD_NEW]: <AddNewRoleModal closeModal={close} extraObject={extraObject} />,
							[MODAL_BODY_TYPES.GROUP_ADD_NEW]: <AddGroupModal closeModal={close} extraObject={extraObject} />,
							[MODAL_BODY_TYPES.POST_ADD_NEW]: <AddPostModal closeModal={close} extraObject={extraObject} />,
							[MODAL_BODY_TYPES.EDU_ADD_NEW]: <AddEduModal closeModal={close} extraObject={extraObject} />,
							[MODAL_BODY_TYPES.CONFIRMATION]: <ConfirmationModalBody extraObject={extraObject} closeModal={close} remove={remove} />,
							[MODAL_BODY_TYPES.DEFAULT]: <div></div>
						}[bodyType]
					}
				</div>
			</div>
		</>
	);
}


export default ModalLayout