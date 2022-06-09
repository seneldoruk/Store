import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

interface Props {
  options: any[];
  onChange: (event: any) => void;
  selectedValue: string;
}
export default function RadioButtonGroup({
  options,
  onChange,
  selectedValue,
}: Props) {
  return (
    <RadioGroup onChange={onChange}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          checked={option.value === selectedValue}
          control={<Radio />}
          label={option.label}
        />
      ))}
    </RadioGroup>
  );
}
