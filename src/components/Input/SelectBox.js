// import React, {useState} from 'react'
// import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'
//
// function SelectBox(props) {
// 	const {
// 		labelTitle,
// 		labelDescription,
// 		defaultValue,
// 		containerStyle,
// 		placeholder,
// 		labelStyle,
// 		options,
// 		updateType,
// 		updateFormValue,
// 		isMulti = false
// 	} = props;
//
// 	const [value, setValue] = useState(defaultValue || (isMulti ? [] : ""));
//
// 	const updateValue = (newValue) => {
// 		updateFormValue({ updateType, value: newValue });
// 		setValue(newValue);
// 	};
//
// 	const handleChange = (e) => {
// 		if (isMulti) {
// 			const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
// 			updateValue(selectedOptions);
// 		} else {
// 			updateValue(e.target.value);
// 		}
// 	};
//
// 	return (
// 		<div className={`inline-block ${containerStyle}`}>
// 			<label className={`label ${labelStyle}`}>
// 				<div className="label-text">
// 					{labelTitle}
// 					{labelDescription && (
// 						<div className="tooltip tooltip-right" data-tip={labelDescription}>
// 							<InformationCircleIcon className="w-4 h-4" />
// 						</div>
// 					)}
// 				</div>
// 			</label>
//
// 			<select
// 				className="select select-bordered w-full"
// 				value={value}
// 				onChange={handleChange}
// 				multiple={isMulti}
// 			>
// 				{!isMulti && <option disabled value="PLACEHOLDER">{placeholder}</option>}
// 				{options?.map((o, k) => (
// 					<option value={o.value || o.name} key={k}>{o.name}</option>
// 				))}
// 			</select>
// 		</div>
// 	);
// }
//
//
// export default SelectBox

import Select from 'react-select';

function SelectBox({
	                   labelTitle,
	                   placeholder,
	                   containerStyle,
	                   options,
	                   updateType,
	                   updateFormValue,
	                   isMulti = false,
	                   defaultValue = null
                   }) {
	const handleChange = (selected) => {
		if (isMulti) {
			updateFormValue({
				updateType,
				value: selected ? selected.map(opt => opt.value) : [],
			});
		} else {
			updateFormValue({
				updateType,
				value: selected?.value || "",
			});
		}
	};
	
	return (
		<div className={`form-control w-full ${containerStyle}`}>
			<label className="label">{labelTitle}</label>
			<Select
				options={options}
				isMulti={isMulti}
				placeholder={placeholder}
				defaultValue={defaultValue}
				onChange={handleChange}
			/>
		</div>
	);
}

export default SelectBox;
