import {useEffect, useState} from "react"


function InputText({
	                   labelTitle,
	                   labelStyle,
	                   type,
	                   containerStyle,
	                   defaultValue,
	                   placeholder,
	                   updateFormValue,
	                   updateType
                   }) {
	
	const [value, setValue] = useState(defaultValue)
	
	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])
	
	const updateInputValue = (val) => {
		setValue(val)
		updateFormValue({updateType, value: val})
	}
	
	return (
		<div className={`form-control w-full ${containerStyle}`}>
			<label className="label">
				<span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
			</label>
			{type === "checkbox" ? (
				<input
					type={"checkbox"}
					checked={value}
					onChange={(e) => updateInputValue(e.target.checked)}
					placeholder={placeholder || ""}
					className="checkbox checkbox-primary"
				/>
			) : (
				<input
					type={type || "text"}
					value={value}
					placeholder={placeholder || ""}
					onChange={(e) => updateInputValue(e.target.value)}
					className="input input-bordered w-full"
				/>
			)}
		</div>
	)
}


export default InputText