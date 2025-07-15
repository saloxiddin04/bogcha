// import {useEffect, useState} from "react"
//
//
// function InputText({
// 	                   labelTitle,
// 	                   labelStyle,
// 	                   type,
// 	                   containerStyle,
// 	                   defaultValue,
// 	                   placeholder,
// 	                   updateFormValue,
// 	                   updateType
//                    }) {
//
// 	const [value, setValue] = useState(defaultValue)
//
// 	useEffect(() => {
// 		setValue(defaultValue)
// 	}, [defaultValue])
//
// 	const updateInputValue = (val) => {
// 		setValue(val)
// 		updateFormValue({updateType, value: val})
// 	}
//
// 	return (
// 		<div className={`form-control w-full ${containerStyle}`}>
// 			<label className="label">
// 				<span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
// 			</label>
// 			{type === "checkbox" ? (
// 				<input
// 					type={"checkbox"}
// 					checked={value}
// 					onChange={(e) => updateInputValue(e.target.checked)}
// 					placeholder={placeholder || ""}
// 					className="checkbox checkbox-primary"
// 				/>
// 			) : (
// 				<input
// 					type={type || "text"}
// 					value={value}
// 					placeholder={placeholder || ""}
// 					onChange={(e) => updateInputValue(e.target.value)}
// 					className="input input-bordered w-full"
// 				/>
// 			)}
// 		</div>
// 	)
// }
//
//
// export default InputText

import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

function InputText({
	                   labelTitle,
	                   labelStyle,
	                   type,
	                   containerStyle,
	                   defaultValue,
	                   placeholder,
	                   updateFormValue,
	                   updateType,
	disabled
                   }) {
	const [value, setValue] = useState(defaultValue);
	const [showPassword, setShowPassword] = useState(false); // 👈 password visibility state
	
	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);
	
	const updateInputValue = (val) => {
		setValue(val);
		updateFormValue({ updateType, value: val });
	};
	
	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};
	
	return (
		<div className={`form-control w-full relative ${containerStyle}`}>
			{labelTitle && (
				<label className="label">
					<span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
				</label>
			)}
			{type === "checkbox" ? (
				<input
					type="checkbox"
					checked={value}
					onChange={(e) => updateInputValue(e.target.checked)}
					placeholder={placeholder || ""}
					className="checkbox checkbox-primary"
					disabled={disabled}
				/>
			) : (
				<div className="relative">
					<input
						type={type === "password" ? (!showPassword ? "password" : "text") : type}
						value={value}
						placeholder={placeholder || ""}
						onChange={(e) => updateInputValue(e.target.value)}
						className="input input-bordered w-full pr-10"
						disabled={disabled}
					/>
					{type === "password" && (
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
						>
							{showPassword ? (
								<EyeSlashIcon className="h-5 w-5" />
							) : (
								<EyeIcon className="h-5 w-5" />
							)}
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default InputText;
