import Select from 'react-select';
import {useEffect, useState} from "react";

function SelectBox({
	                   labelTitle,
	                   placeholder,
	                   containerStyle,
	                   options,
	                   updateType,
	                   updateFormValue,
	                   isMulti = false,
	                   defaultValue = null,
	                   styles
                   }) {
	
	const [value, setValue] = useState(defaultValue)
	
	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])
	
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
				value={value}
				onChange={handleChange}
				styles={styles}
			/>
		</div>
	);
}

export default SelectBox;
