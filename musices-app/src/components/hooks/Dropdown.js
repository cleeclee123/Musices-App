import React from 'react';

const Dropdown = props => {    

    const dropdownChanged = e => {
        props.changed(e.target.value);

    }    

    return (
        <div className = "dropdown-dd">     
            <label className = "label-dd"> {props.label} </label>       
            
            <select value = {props.selectedValue} onChange = {dropdownChanged} className = "form-control form-control-sm col-sm-10">
                <option key = {0}> Select... </option>
                {props.options.map((item, idx) => <option key = {idx + 1} value = {item.id}> {item.name} </option>)}
            </select>

        </div>
    );
}

export default Dropdown;