import Label from "../../atoms/Label/Label";

type InputProps = {
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  isTouched?: boolean;
  errors?: string;
};

const Input = ({
  label,
  type = "text",
  placeholder,
  name,
  onChange,
  onBlur,
  value,
  errors,
  isTouched,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label id={name} text={label} />
        <input
          id={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          className="border rounded-lg p-2"
          type={type}
          placeholder={placeholder}
        />
      </div>
      {isTouched && errors && value.trim().length > 2 ? (
        <span aria-live="polite" className="pl-2 text-red-500 font-semibold">
          {errors}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
