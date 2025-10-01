import React, {useState, useEffect} from "react";
import SelectBox from "../../../components/Input/SelectBox";
import InputText from "../../../components/Input/InputText";
import {useDispatch} from "react-redux";
import {getUsersForDashboard} from "../dashboardSlice";

const fieldConfigs = {
	come_or_went: {
		type: "select",
		label: "Come / Went",
		options: [
			{label: "Come", value: "come"},
			{label: "Went", value: "went"},
		],
		default: "come",
	},
	start_date: {
		type: "date",
		label: "Start date",
		default: null,
	},
	end_date: {
		type: "date",
		label: "End date",
		default: null,
	},
	date_time: {
		type: "date",
		label: "Date time",
		default: null,
	},
	person_type: {
		type: "select",
		label: "Person type",
		options: [
			{label: "Family member", value: "FAMILY_MEMBER"},
			{label: "Children", value: "CHILDREN"},
			{label: "Employee", value: "EMPLOYEE"},
			{label: "Teacher", value: "TEACHER"}
		],
		default: "EMPLOYEE",
	},
	group_id: {
		type: "select",
		label: "Group",
		options: [],
		default: "",
	},
	user: {
		type: "select",
		label: "User",
		options: [],
		default: "",
	},
};

const StatsFilter = ({fields, onChange, groupOptions = [], userOptions = []}) => {
	const dispatch = useDispatch()
	
	// initial filters state
	const initialFilters = fields.reduce((acc, f) => {
		acc[f] = fieldConfigs[f]?.default || "";
		return acc;
	}, {});
	
	const [filters, setFilters] = useState(initialFilters);
	
	useEffect(() => {
		onChange(filters);
	}, [filters]);
	
	const handleChange = ({updateType, value}) => {
		setFilters((prev) => ({
			...prev,
			[updateType]: value,
		}));
		if (updateType === "group_id") {
			setFilters((prev) => ({
				...prev,
				user: null,
			}));
			dispatch(getUsersForDashboard({group_id: value}));
		}
	};
	
	return (
		<div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-3 mb-3 p-3 rounded-lg shadow-sm">
			{fields.map((f) => {
				const cfg = fieldConfigs[f];
				if (!cfg) return null;
				
				if (cfg.type === "select") {
					// special case: group_id, user
					let options = cfg.options;
					if (f === "group_id") options = groupOptions;
					if (f === "user") options = userOptions;
					
					return (
						<div key={f} className="form-control w-full flex items-end gap-2 flex-row">
							<SelectBox
								key={f}
								options={options}
								labelTitle={cfg.label}
								placeholder={`Choose ${cfg.label.toLowerCase()}...`}
								containerStyle="w-full"
								updateType={f}
								updateFormValue={handleChange}
								isMulti={false}
								defaultValue={
									options.find((opt) => opt.value === filters[f]) || cfg.default
								}
							/>
							
							{f !== "come_or_went" &&  f !== "person_type" && (
								<button
									type="button"
									onClick={() => {
										handleChange({updateType: f, value: cfg.default});
									}}
									className="mb-1 px-2 py-1 text-sm text-black bg-gray-200 hover:bg-gray-300 rounded"
								>
									✕
								</button>
							)}
						</div>
					);
				}
				
				if (cfg.type === "date" || cfg.type === "datetime-local") {
					return (
						<div key={f} className="form-control w-full flex items-end gap-2 flex-row">
							<div className="form-control w-full relative">
								<label className="label">
									<span className={`label-text text-base-content`}>{cfg.label}</span>
								</label>
								<input
									type={cfg.type}
									value={filters[f] || ""}
									onChange={(e) => handleChange({updateType: f, value: e.target.value})}
									className="input input-bordered w-full pr-2"
								/>
							</div>
							{/*<InputText*/}
							{/*	type={cfg.type}*/}
							{/*	value={filters[f] || ""}*/}
							{/*	updateType={f}*/}
							{/*	labelTitle={cfg.label}*/}
							{/*	updateFormValue={handleChange}*/}
							{/*/>*/}
							<button
								type="button"
								onClick={() => {
									handleChange({updateType: f, value: null});
								}}
								className="mb-1 px-2 py-1 text-sm text-black bg-gray-200 hover:bg-gray-300 rounded"
							>
								✕
							</button>
						</div>
					);
				}
				
				
				return null;
			})}
		</div>
	);
};

export default StatsFilter;
