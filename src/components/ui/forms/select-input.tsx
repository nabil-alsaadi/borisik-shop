import { Controller } from 'react-hook-form';
import Label from '@/components/ui/forms/label'; // Assuming you have a Label component
import Select from '../select/select';

interface SelectInputProps {
  name: string;
  control: any; // react-hook-form control
  options: Array<{ value: string; label: string }>; // Options for the select
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  error?: string;
  required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  control,
  options,
  label,
  placeholder,
  isDisabled = false,
  isLoading = false,
  error,
  required = false,
}) => {
  return (
    <div className="mb-5">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500"> *</span>} {/* Add red asterisk if required */}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isDisabled={isDisabled}
            isLoading={isLoading}
            placeholder={placeholder}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        )}
      />
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectInput;
