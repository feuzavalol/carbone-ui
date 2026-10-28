import { useState, useEffect } from "react";
import "./style/FoodForm.css";
import type { CompleteFood } from "../types/foodTypes";
import { useNavigate } from "react-router-dom";
import { removeFood } from "../fetching/UseFood";
import { useAuth } from "../auth/AuthContext";
import { MissingToken, MissingTokenMessage } from "../fetching/ErrorHandling";

type ErrorsObject = {
  name: string,
  costPerUnit: string,
  unit: string,
  source: string,
  foodGroup: string,
  subFoodGroup: string
}

const EmptyErrorsObject: () => ErrorsObject = () => {
  return {
    name: "", costPerUnit: "", unit: "", source: "", foodGroup: "", subFoodGroup: ""
  };
} 

type Form = {
  name: string,
  costPerUnit: string,
  unit: string,
  source: string,
  foodGroup: string,
  subFoodGroup: string,
  details: string
}

type RemoveWrapper = {
  isRemoving: boolean,
  removeError : Error | null,
  removedItem: CompleteFood | null
}


const isEmpty = (form: ErrorsObject | Form) => {
  return Object.values(form).every(x => x === null || x === '');
}

const validateExisting = (form: Form) => {
    const newErrorsObject = EmptyErrorsObject();
    const cost = Number(form.costPerUnit);
    if (form.costPerUnit === "" || Number.isNaN(cost) || cost <= 0)
      newErrorsObject.costPerUnit = "Entrez un nombre supérieur à 0.";
    if (!form.source.trim()) newErrorsObject.source = "Précisez une source.";
    return {errors: newErrorsObject, isValid: isEmpty(newErrorsObject)};
};

const validateNew = (form: Form, unitOptions: string[], foodGroupOptions: string[], subFoodGroupOptions: string[]) => {
    const newErrorsObject = EmptyErrorsObject();
    if (!form.name.trim()) newErrorsObject.name = "Un nom est requis.";
    if (!unitOptions.includes(form.unit)) newErrorsObject.unit = "Choisissez une unité."
    if (!foodGroupOptions.includes(form.foodGroup)) newErrorsObject.foodGroup = "Choisissez une catégorie.";
    if (!subFoodGroupOptions.includes(form.subFoodGroup)) newErrorsObject.subFoodGroup = "Choisissez une sous-catégorie.";
    const cost = Number(form.costPerUnit);
    if (form.costPerUnit === "" || Number.isNaN(cost) || cost <= 0)
      newErrorsObject.costPerUnit = "Entrez un nombre supérieur à 0.";
    if (!form.source.trim()) newErrorsObject.source = "Précisez une source.";
    return {errors: newErrorsObject, isValid: isEmpty(newErrorsObject)};
};

/**
 * Form for editing a food item.
 *
 * Props:
 *  - item:          { id, name, costPerUnit, unit, foodGroup, subFoodGroup, source, details }
 *  - unitOptions:   string[]  allowed values for `unit`
 *  - sourceOptions: string[]  allowed values for `source`
 *  - onSubmit:      (updatedItem) => void   called with the full object, id included
 */
export default function FoodForm({
  item,
  unitOptions, 
  foodGroupOptions,
  subFoodGroupOptions,
  onSubmit = (updated) => console.log("Submitted:", updated),
  alreadyExists,
  previousPage
}: 
{item: CompleteFood | undefined, unitOptions: string[], foodGroupOptions: string[], subFoodGroupOptions: string[], alreadyExists: boolean, onSubmit: (updatedItem: CompleteFood, isRemoving: boolean) => void, previousPage: string}) {
  if (item == undefined){return;}
  let navigate = useNavigate();
  const { token } = useAuth();

  const validate = alreadyExists ? () => validateExisting(form) : () => validateNew(form, unitOptions, foodGroupOptions, subFoodGroupOptions);
  // Keep cost as a string while editing so users can type "0." etc.
  const toForm = (it: any) => ({ ...it, costPerUnit: String(it?.costPerUnit ?? "") });

  const [form, setForm] = useState(toForm(item));
  const [errors, setErrors] = useState<ErrorsObject>(EmptyErrorsObject());

  // Handle the pop-up to delete the item from the db
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [removeObject, setRemoveObject] = useState<RemoveWrapper>({isRemoving: false, removeError: null, removedItem: null})

  // Re-sync if a different item is passed in
  useEffect(() => {
    setForm(toForm(item));
    setErrors(EmptyErrorsObject());
  }, [item]);

  if (token == null){
      return MissingTokenMessage;
  }
  const safeToken: string = token;

  const hasChanged = Object.keys(form).some(
    (k) => String(form[k]) !== String(toForm(item)[k])
  );

  const handleChange = (e) => {
    const { name, value }: {name: string, value: string | number} = e.target;
    setForm((prev: CompleteFood) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

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
      costPerUnit: Number(form.costPerUnit)
    },
    removeObject.isRemoving);
  };

  const handleReset = () => {
    setForm(toForm(item));
    setErrors(EmptyErrorsObject());
  };

  const changeRemoveObject = (name: string, value: string | null | CompleteFood | boolean) => {
    setRemoveObject((prev: RemoveWrapper) => ({ ...prev, [name]: value }));
  }

  // Pop-up to delete the item from the database
  const handleOpen = (removedFood: CompleteFood) => {
    setRemoveObject((prev: RemoveWrapper) => ({ ...prev, removedItem: removedFood }));
    setIsOpen(true)
  };
  const handleCancel = () => setIsOpen(false);

  const handleRemoveItem = (removedElement: CompleteFood) => {
    /*Removes the item inside the list displayed in the UI*/
    navigate(previousPage);
  };

  async function handleRemove() {
    if (removeObject.removedItem !== null){
      let response;
      try {
        response = await removeFood(removeObject.removedItem, safeToken);
        // e.g. show a success toast, reset form, etc.
      } catch (err) {
        changeRemoveObject("removeError", err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        changeRemoveObject("removedItem", null);
        setIsOpen(false);
        if (response.success != null){
          handleRemoveItem(removeObject.removedItem);
        }
        else {
          changeRemoveObject("isRemoving", false);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="food-form">
      <Field label="Name" error={errors.name}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass(errors.name)}
        />
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
            value={form.unit}
            onChange={handleChange}
            className={inputClass(errors.unit)}
          >
            {/* Keep an out-of-pool existing value visible so it isn't silently lost */}
            {!unitOptions.includes(form.unit) && (
              <option value={form.unit}>{form.unit || "Choisissez une unité"}</option>
            )}
            {unitOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="food-form__row">
      <Field label="Food group" error={errors.foodGroup}>
          <select
            name="foodGroup"
            value={form.foodGroup}
            onChange={handleChange}
            className="food-form__input"
          >
            {/* Keep an out-of-pool existing value visible so it isn't silently lost */}
            {!foodGroupOptions.includes(form.foodGroup) && (
              <option value={form.foodGroup}>{form.foodGroup || "Choisissez une catégorie"}</option>
            )}
            {foodGroupOptions.map((fg) => (
              <option key={fg} value={fg}>
                {fg}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sub food group" error={errors.subFoodGroup}>
          <select
            name="subFoodGroup"
            value={form.subFoodGroup}
            onChange={handleChange}
            className="food-form__input"
          >
            {/* Keep an out-of-pool existing value visible so it isn't silently lost */}
            {!subFoodGroupOptions.includes(form.subFoodGroup) && (
              <option value={form.subFoodGroup}>{form.subFoodGroup || "Choisissez une sous-catégorie"}</option>
            )}
            {subFoodGroupOptions.map((sfg) => (
              <option key={sfg} value={sfg}>
                {sfg}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Source" error={errors.source}>
        <textarea
          name="source"
          rows={3}
          value={form.source || ""}
          required
          onChange={handleChange}
          className="food-form__input food-form__textarea"
        />
      </Field>

      <Field label="Détails">
        <textarea
          name="details"
          rows={2}
          value={form.details || ""}
          onChange={handleChange}
          className="food-form__input food-form__textarea"
        />
      </Field>
      
      <div className="food-form__actions">
        <button
          type="button"
          onClick={()=>handleOpen(form)}
          disabled={!alreadyExists}
          className="food-form__button food-form__button--secondary"
        >
          Delete
        </button>
        {/* Pop-up / Modal */}
        {isOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Êtes-vous sûr ?</h3>
              <p>Voulez-vous vraiment supprimer cette ligne ?</p>
              <div className="modal-actions">
                <button onClick={handleCancel}>Annuler</button>
                <button onClick={handleRemove}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
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