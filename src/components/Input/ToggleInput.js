import {useEffect, useState} from "react"


function ToggleInput({labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType}){

    const [value, setValue] = useState(defaultValue)
    
    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    const updateToggleValue = () => {
        setValue(!value)
        updateFormValue({updateType, value : !value})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label cursor-pointer">
                <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
                <input type="checkbox" className="toggle" checked={value}  onChange={(e) => updateToggleValue()}/>
            </label>
        </div>
    )
}


export default ToggleInput
