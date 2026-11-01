const inputClass = (hasError? : string) =>
  `food-form__input${hasError ? " food-form__input--error" : ""}`;

function Field({ label, error, children }: {label: string, error?: string, children: any}) {
  return (
    <label className="food-form__field">
      <span className="food-form__label">{label}</span>
      {children}
      {error && <span className="food-form__error">{error}</span>}
    </label>
  );
}

export { inputClass, Field }