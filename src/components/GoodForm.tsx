import { useState, useEffect } from "react";
import "./style/FoodForm.css";
import type { CompleteGood } from "../types/goodsTypes";

type ErrorsObject = {
  name: string,
  category: string,
  expectedUnit: string,
  costPerUnit: string,
  unit: string,
  source: string,
  details: string,
  comments: string
}

const EmptyErrorsObject: () => ErrorsObject = () => {
  return {
    name: "",
    category: "",
    expectedUnit: "",
    costPerUnit: "",
    unit: "",
    source: "",
    details: "",
    comments: ""
  };
} 

type Form = {
  name: string,
  category: string,
  expectedUnit: string,
  costPerUnit: string,
  unit: string,
  source: string,
  details: string,
  comments: string
}

const isEmpty = (form: Form) => {
  return Object.values(form).every(x => x === null || x === '');
}

const validateExisting = (form: Form, categoryOptions: string[]) => {
    const newErrorsObject = EmptyErrorsObject();
    if (!categoryOptions.includes(form.category)) newErrorsObject.category = "Choisissez une catégorie.";
    const cost = Number(form.costPerUnit);
    if (form.costPerUnit === "" || Number.isNaN(cost) || cost <= 0)
      newErrorsObject.costPerUnit = "Entrez un nombre supérieur à 0.";
    if (!form.source.trim()) newErrorsObject.source = "Précisez une source.";
    // setErrors(newErrorsObject);
    return {errors: newErrorsObject, isValid: isEmpty(newErrorsObject)};
};

const validateNew = (form: Form, categoryOptions: string[], expectedUnitOptions: string[]) => {
    const newErrorsObject = EmptyErrorsObject();
    if (!form.name.trim()) newErrorsObject.name = "Un nom est requis.";
    if (!categoryOptions.includes(form.category)) newErrorsObject.category = "Choisissez une catégorie.";
    if (!expectedUnitOptions.includes(form.expectedUnit)) newErrorsObject.expectedUnit = "Choisissez une unité.";
    const cost = Number(form.costPerUnit);
    if (form.costPerUnit === "" || Number.isNaN(cost) || cost <= 0)
      newErrorsObject.costPerUnit = "Entrez un nombre supérieur à 0.";
    if (!form.source.trim()) newErrorsObject.source = "Précisez une source.";
    // setErrors(newErrorsObject);
    return {errors: newErrorsObject, isValid: isEmpty(newErrorsObject)};
};

function toUnitOption(expectedUnit: string){
    return "kgCO2eq/"+expectedUnit;
}

function toUnitOptions(expectedUnitOptions: string[]){
    return expectedUnitOptions.map((expectedUnit: string) => toUnitOption(expectedUnit));
}

/**
 * Form for editing a food item.
 *
 * Props:
 *  - item:          { id, name, costPerUnit, unit, food_group, sub_food_group, source, details }
 *  - unitOptions:   string[]  allowed values for `unit`
 *  - sourceOptions: string[]  allowed values for `source`
 *  - onSubmit:      (updatedItem) => void   called with the full object, id included
 */
export default function GoodForm({
    item,
    expectedUnitOptions,
    categoryOptions,
    onSubmit,
    alreadyExists // Whether the good already exists in the db or not
}: 
{item: CompleteGood | undefined, expectedUnitOptions: string[], categoryOptions: string[], onSubmit: (updatedItem: CompleteGood) => void, alreadyExists: boolean}) {
  if (item == undefined){return;}

  const validate = alreadyExists ? () => validateExisting(form, categoryOptions) : () => validateNew(form, categoryOptions, expectedUnitOptions);
  const unitOptions = toUnitOptions(expectedUnitOptions);
  // Keep cost as a string while editing so users can type "0." etc.
  const toForm = (it: any) => ({ ...it, costPerUnit: String(it?.costPerUnit ?? "") });

  const [form, setForm] = useState(toForm(item));
  const [errors, setErrors] = useState<ErrorsObject>(EmptyErrorsObject());

  // Re-sync if a different item is passed in
  useEffect(() => {
    setForm(toForm(item));
    setErrors(EmptyErrorsObject());
  }, [item]);

  useEffect(() => {
    setForm((prev: CompleteGood) => ({ ...prev, ["unit"]: toUnitOption(form.expectedUnit) }));
  }, [form.expectedUnit]);

  useEffect(() => {
    setForm((prev: CompleteGood) => ({ ...prev, ["expectedUnit"]: form.unit.replace("kgCO2eq/","") }));
  }, [form.unit])

  const hasChanged = Object.keys(form).some(
    (k) => String(form[k]) !== String(toForm(item)[k])
  );

  const handleChange = (e) => {
    const { name, value }: {name: string, value: string | number} = e.target;
    setForm((prev: CompleteGood) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

//   useEffect(() => {
//     console.log(form);
//   }, [form])

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validate();
    if (!result.isValid){
      setErrors(result.errors);
      return;
    }
    onSubmit({
      ...form,
      id: item.id, // never editable
      name: form.name.trim(),
      costPerUnit: Number(form.costPerUnit),
    });
  };

  const handleReset = () => {
    setForm(toForm(item));
    setErrors(EmptyErrorsObject());
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="food-form">
      <Field label="Name" error={errors.name}>
        <input
          name="name"
          disabled={alreadyExists}
          value={form.name}
          onChange={handleChange}
          className={inputClass(errors.name)}
        />
      </Field>

      <Field label="Catégorie" error={errors.category}>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass(errors.category)}
          >
            {/* Keep an out-of-pool existing value visible so it isn't silently lost */}
            {!categoryOptions.includes(form.category) && (
              <option value={form.category}>{form.category || "choisissez une unité"}</option>
            )}
            {categoryOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
      </Field>

      <Field label="Unité attendue" error={errors.expectedUnit}>
          <select
            name="expectedUnit"
            disabled={alreadyExists}
            value={form.expectedUnit}
            onChange={handleChange}
            className={inputClass(errors.expectedUnit)}
          >
            {/* Keep an out-of-pool existing value visible so it isn't silently lost */}
            {!expectedUnitOptions.includes(form.expectedUnit) && (
              <option value={form.expectedUnit}>{form.expectedUnit || "choisissez une unité"}</option>
            )}
            {expectedUnitOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
      </Field>

      <div className="food-form__row">
        <Field label="Cost per unit" error={errors.costPerUnit}>
          <input
            name="costPerUnit"
            type="number"
            step={0.1}
            min="0"
            value={form.costPerUnit}
            onChange={handleChange}
            className={inputClass(errors.costPerUnit)}
          />
        </Field>

        <Field label="Unit" error={errors.unit}>
          <select
            name="unit"
            disabled={alreadyExists}
            value={form.unit}
            onChange={handleChange}
            className={inputClass(errors.unit)}
          >
            {/* Keep an out-of-pool existing value visible so it isn't silently lost */}
            {!unitOptions.includes(form.unit) && (
              <option value={form.unit}>{form.unit || "Select a unit"}</option>
            )}
            {unitOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Source" error={errors.source}>
        <textarea
          name="source"
          rows={3}
          value={form.source}
          required
          onChange={handleChange}
          className="food-form__input food-form__textarea"
        />
      </Field>

      <Field label="Détails">
        <textarea
          name="details"
          rows={2}
          value={form.details}
          onChange={handleChange}
          className="food-form__input food-form__textarea"
        />
      </Field>

      <Field label="Commentaire">
        <textarea
          name="comments"
          rows={2}
          value={form.comments}
          onChange={handleChange}
          className="food-form__input food-form__textarea"
        />
      </Field>

      <div className="food-form__actions">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanged}
          className="food-form__button food-form__button--secondary"
        >
          Discard changes
        </button>
        <button
          type="submit"
          disabled={!hasChanged}
          className="food-form__button food-form__button--primary"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

const inputClass = (hasError) =>
  `food-form__input${hasError ? " food-form__input--error" : ""}`;

function Field({ label, error, children }) {
  return (
    <label className="food-form__field">
      <span className="food-form__label">{label}</span>
      {children}
      {error && <span className="food-form__error">{error}</span>}
    </label>
  );
}