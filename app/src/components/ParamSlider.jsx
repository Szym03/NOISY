import { useState } from "react";

function ParamSlider({ label, defaultValue = 0.5, onChange }) {
  const [value, setValue] = useState(defaultValue);

  function handleChange(event) {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    onChange(newValue);
  }

  return (
    <div className="param-slider">
      <label>{label}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={handleChange}
      />
      <span>{Math.round(value * 100)}%</span>
    </div>
  );
}

export default ParamSlider;