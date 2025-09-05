import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {hasPermission} from "../../auth/jwtService";
import {openModal} from "../common/modalSlice";
import {MODAL_BODY_TYPES} from "../../utils/globalConstantUtil";
import TitleCard from "../../components/Cards/TitleCard";
import {getAllPosts} from "./smmPostSlice";
import Pagination from "../../components/Pagination";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import {PaperAirplaneIcon, PencilIcon} from "@heroicons/react/20/solid";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";

const TopSideButtons = () => {
	
	const dispatch = useDispatch()
	
	const openAddNewLeadModal = () => {
		dispatch(openModal({title: "Add New Post", bodyType: MODAL_BODY_TYPES.POST_ADD_NEW}))
	}
	
	return (
		<div className="inline-block float-right">
			{hasPermission("smm_add") && (
			<button
				className="btn px-6 btn-sm normal-case btn-primary"
				onClick={() => openAddNewLeadModal()}
			>
				Add New Post
			</button>
			)}
		</div>
	)
}

const SmmPost = () => {
	const dispatch = useDispatch()
	const {loading, posts} = useSelector((state) => state.posts)
	
	useEffect(() => {
		dispatch(getAllPosts())
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getAllPosts({page_size: 10, page}))
	};
	
	const deleteCurrentPost = (id) => {
		dispatch(openModal({
			title: 'Confirmation',
			bodyType: 'CONFIRMATION',
			extraObject: {
				message: 'Are you sure you want to delete this group?',
				notification: 'Successfully deleted!',
				actionKey: 'DELETE_POST',
				payload: id
			}
		}));
	};
	
	const openAddNewPostModal = (id) => {
		dispatch(openModal({
			title: "Edit Group",
			bodyType: MODAL_BODY_TYPES.POST_ADD_NEW,
			extraObject: {
				notification: 'Successfully edited!',
				id,
				is_edit: true
			}
		}))
	}
	
	return (
		<>
			<TitleCard title="Current SMM Post" topMargin="mt-2" TopSideButtons={<TopSideButtons/>}>
				<div className="overflow-x-auto w-full">
					<table className="table w-full">
						<thead>
						<tr className="text-center">
							<th>ID</th>
							<th>Title</th>
							<th>Author</th>
							<th>Children</th>
							<th>Description</th>
							<th>Post and history</th>
							<th>Actions</th>
						</tr>
						</thead>
						<tbody>
						{posts?.data?.map((item) => (
							<tr key={item?.id} className="text-center">
								<td>{item?.id}</td>
								<td>{item?.title}</td>
								<td>{item?.author?.full_name}</td>
								<td>{item?.users?.length}</td>
								<td>{item?.description}</td>
								<td>
									<button
										className="btn btn-square btn-success text-white"
										// onClick={() => deleteCurrentGroup(item?.id)}
									>
										<Bars3Icon className="w-5"/>
									</button>
								</td>
								<td className="flex gap-1 justify-center">
									<button
										className="btn btn-square btn-success text-white"
										onClick={() => {
											dispatch(openModal({
												title: 'Confirmation',
												bodyType: 'CONFIRMATION',
												extraObject: {
													message: 'Are you sure you want to send this post?',
													notification: 'Successfully deleted!',
													actionKey: 'SEND_POST',
													payload: item?.id
												}
											}));
										}}
										disabled={!hasPermission("smm_post_t")}
									>
										<PaperAirplaneIcon className="w-5"/>
									</button>
									<button
										className="btn btn-sm btn-error text-white"
										onClick={() => deleteCurrentPost(item?.id)}
										disabled={!hasPermission("smm_del")}
									>
										<TrashIcon className="w-5"/>
									</button>
									<button
										className="btn btn-sm btn-warning text-white"
										onClick={() => openAddNewPostModal(item?.id)}
										disabled={!hasPermission("smm_edit")}
									>
										<PencilIcon className="w-5"/>
									</button>
									<button
										className="btn btn-sm btn-success text-white"
										onClick={() => openAddNewPostModal(item?.id)}
										disabled={!hasPermission("smm_det")}
									>
										<ChevronRightIcon className="w-5"/>
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
				
				<Pagination
					totalItems={posts?.pagination?.total_items}
					itemsPerPage={10}
					onPageChange={handlePageChange}
				/>
			</TitleCard>
		</>
	);
};

export default SmmPost;