import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

interface Props {
  options: string[];
  checked?: string[];
  onChange: (items: string[]) => void;
}

export default function CheckBoxButtons({ options, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked || []);
  const handleCheck = (value: string) => {
    let newArray: string[] = [];
    const index = checkedItems.indexOf(value);
    if (index < 0) {
      newArray = [...checkedItems, value];
    } else {
      newArray = checkedItems.filter(
        (item) => checkedItems.indexOf(item) !== index
      );
    }
    setCheckedItems(newArray);
    onChange(newArray);
  };
  return (
    <FormGroup>
      {options.map((option) => (
        <FormControlLabel
          onClick={() => handleCheck(option)}
          checked={checkedItems.indexOf(option) !== -1}
          control={<Checkbox />}
          label={option}
          key={option}
        />
      ))}
    </FormGroup>
  );
}
