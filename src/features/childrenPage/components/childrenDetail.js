import React from 'react';
import TitleCard from "../../../components/Cards/TitleCard";
import LineChart from "../../dashboard/components/LineChart";
import BarChart from "../../dashboard/components/BarChart";
import {UserCircleIcon} from "@heroicons/react/20/solid";
import InputText from "../../../components/Input/InputText";

const ChildrenDetail = () => {
	return (
		<>
			<TitleCard title="Current Children Detail" topMargin="mt-2">
				<div className="flex justify-between items-center">
					<div className="flex flex-col w-[49%] justify-center items-center">
						<UserCircleIcon className="w-48"/>
						<h1>Jasurbek Anvarov Anvarovich</h1>
					</div>
					<div className="w-[49%] flex flex-col gap-2">
						<InputText
							type="text"
							defaultValue={"27.01.2004"}
							updateType="birth_day"
							labelTitle="Birth day"
							disabled={true}
							// updateFormValue={updateFormValue}
						/>
						<InputText
							type="text"
							defaultValue={"140"}
							updateType="birth_day"
							labelTitle="Height"
							disabled={true}
							// updateFormValue={updateFormValue}
						/>
						<InputText
							type="text"
							defaultValue={"38"}
							updateType="birth_day"
							labelTitle="Weight"
							disabled={true}
							// updateFormValue={updateFormValue}
						/>
					</div>
				</div>
				<div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
					<LineChart/>
					<BarChart/>
				</div>
			</TitleCard>
		</>
	);
};

export default ChildrenDetail;