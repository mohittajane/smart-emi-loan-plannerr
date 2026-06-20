import { ChangeEvent } from "react";

type Props = {
  label: string;
  value: string | number;
  name: string;
  unit?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
};

const InputCard = ({ label, unit, value, name, onChange, min, max, step }: Props) => {
  return (
    <label className="input-card">
      <span>{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type="number"
        min={min}
        max={max}
        step={step}
        className="glass-input"
      />
      {unit ? <small>{unit}</small> : null}
    </label>
  );
};

export default InputCard;
