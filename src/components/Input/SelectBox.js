import Select from 'react-select';
import { useEffect, useState } from "react";

function SelectBox({
	                   labelTitle,
	                   placeholder,
	                   containerStyle,
	                   options,
	                   updateType,
	                   updateFormValue,
	                   isMulti = false,
	                   defaultValue = null,
	                   styles,
	                   value,
	                   onChange
                   }) {
	const [value1, setValue1] = useState(defaultValue);
	
	useEffect(() => {
		setValue1(defaultValue);
	}, [defaultValue]);
	
	const handleChange = (selected) => {
		setValue1(selected); // ✅ tanlovni yangilaymiz
		
		if (isMulti) {
			updateFormValue?.({
				updateType,
				value: selected ? selected.map((opt) => opt.value) : [],
			});
		} else {
			updateFormValue?.({
				updateType,
				value: selected?.value || "",
			});
		}
		
		if (onChange) {
			onChange(selected); // ✅ tashqariga ham uzatamiz
		}
	};
	
	return (
		<div className={`form-control w-full ${containerStyle}`}>
			{labelTitle && <label className="label">{labelTitle}</label>}
			<Select
				options={options}
				isMulti={isMulti}
				placeholder={placeholder}
				value={value ?? value1}   // ✅ tashqaridan value kelsa ishlatamiz
				onChange={handleChange}
				styles={styles}
			/>
		</div>
	);
}

export default SelectBox;
