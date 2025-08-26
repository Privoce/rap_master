"use client";

import React from "react";
import { Radio } from "antd";
import { RadioOption } from "@/types";

interface RadioGroupProps {
  options: RadioOption[];
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  size?: "small" | "middle" | "large";
  buttonStyle?: "outline" | "solid";
}

export default function RadioGroup({
  options,
  value,
  defaultValue,
  onChange,
  size = "middle",
  buttonStyle = "outline",
}: RadioGroupProps) {
  return (
    <Radio.Group
      value={value}
      defaultValue={defaultValue || options[0]?.value}
      onChange={(e) => onChange?.(e.target.value)}
      size={size}
      buttonStyle={buttonStyle}
    >
      {options.map((option) => (
        <Radio.Button
          key={option.value}
          value={option.value}
          style={option.style}
        >
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}
