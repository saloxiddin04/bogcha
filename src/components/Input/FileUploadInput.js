import { useEffect, useState } from "react";

function FileUploadInput({
	                         labelTitle,
	                         labelStyle,
	                         containerStyle,
	                         defaultValue = [],
	                         placeholder,
	                         accept,
	                         multiple = false,
	                         updateFormValue,
	                         updateType,
                         }) {
	const [files, setFiles] = useState(defaultValue);
	
	// useEffect(() => {
	// 	setFiles(defaultValue);
	// }, [defaultValue]);
	
	const handleFileChange = (e) => {
		const selectedFiles = e.target.files[0];
		setFiles(selectedFiles);
		updateFormValue({ updateType, value: selectedFiles });
	};
	
	return (
		<div className={`form-control w-full ${containerStyle}`}>
			<label className="label">
				<span className={"label-text text-base-content " + labelStyle}>
					{labelTitle}
				</span>
			</label>
			<input
				type="file"
				multiple={multiple}
				accept={accept}
				placeholder={placeholder || ""}
				onChange={handleFileChange}
				className="file-input file-input-bordered w-full"
			/>
		</div>
	);
}

export default FileUploadInput;
