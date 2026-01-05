import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { CreatePuzzleForm } from "../CreatePuzzle/CreatePuzzle";

type InputKind = "emoji" | "string" | "url";

interface InputFieldProps {
  name: keyof CreatePuzzleForm;
  label: string;
  placeholder?: string;
  type?: InputKind;
  register: UseFormRegister<CreatePuzzleForm>;
  error?: FieldError;
  autoFocus?: boolean;
  onBlur?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  type = "string",
  register,
  error,
  autoFocus,
  onBlur,
}) => {
  const inputType = type === "url" ? "url" : "text";

  return (
    <label className="block space-y-2 text-sm font-semibold text-cyan-100/90">
      <span className="block text-xs uppercase tracking-[0.2em] text-cyan-300/80">{label}</span>
      <input
        autoFocus={autoFocus}
        type={inputType}
        className="w-full rounded-lg border border-cyan-400/40 bg-slate-800 px-3 py-2 text-slate-100 shadow-inner shadow-black/20 focus:border-fuchsia-400 focus:outline-none"
        placeholder={placeholder}
        {...register(name)}
        onBlur={onBlur}
      />
      {error ? <span className="block text-xs text-rose-300">{error.message}</span> : null}
    </label>
  );
};

export default InputField;
