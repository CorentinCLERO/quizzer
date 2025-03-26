import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MultiSelectProps {
  name: string;
  values: { value: string; label: string; }[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

function MultiSelect({ name, values, defaultValue, onChange }: MultiSelectProps) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-[230px] my-1 mx-5">
        <SelectValue placeholder={name} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {values.map((value, index) => (
            <SelectItem key={index} value={value.value}>{value.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default MultiSelect;