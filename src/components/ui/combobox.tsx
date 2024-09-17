/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */

/* eslint-disable react/jsx-boolean-value */
import type React from "react";

interface ComboboxProps {
  options: string[];
  onChange: (value: string) => void;
  value: string; // Dodanie wartości jako prop
  id?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  onChange,
  value,
  id,
}) => {
  return (
    <div className="w-full">
      <select
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="w-full rounded-md border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="" disabled>
          Wybierz opcję
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
