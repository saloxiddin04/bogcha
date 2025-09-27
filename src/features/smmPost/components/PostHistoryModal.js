import React from 'react';
import InputText from "../../../components/Input/InputText";
import moment from "moment";

const PostHistoryModal = ({extraObject}) => {
	
	return (
		<div>
			{extraObject?.data?.map((el) => (
				<div key={el?.id} className="border p-2 rounded my-2">
					<InputText
						type="text"
						defaultValue={el?.author?.full_name ?? ""}
						labelTitle="Author"
						disabled={true}
					/>
					<InputText
						type="text"
						defaultValue={moment(el?.created_date).format("YYYY-MM-DD") ?? ""}
						labelTitle="Created date"
						disabled={true}
					/>
				</div>
			))}
		</div>
	);
};

export default PostHistoryModal;