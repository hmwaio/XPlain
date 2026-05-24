import type { LabeledInputType } from "../../types/type";

export const LabeledInput = ({
  label,
  placeholder,
  type,
  value,
  onchange,
  maxlength,
}: LabeledInputType) => {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm sm:text-base font-medium text-secondary">
        {label}
      </label>

      <input
        type={type || "text"}
        value={value}
        placeholder={placeholder}
        required
        onChange={onchange}
        maxLength={maxlength || 50}
        className="
          w-full
          h-12 sm:h-14
          px-4
          rounded-2xl
          border border-border
          bg-surface
          text-primary
          text-sm sm:text-base
          placeholder:text-muted
          focus:outline-none
          focus:ring-2 focus:ring-accent/40
          focus:border-accent
          transition
        "
      />
    </div>
  );
};
