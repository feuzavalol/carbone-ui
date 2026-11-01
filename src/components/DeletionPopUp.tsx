import { useState } from "react";
import { createChangeItemRequest, type ChangeItemRequest } from "../types/Requests/ChangeItem";
import type { Item } from "../types/itemTypes";

type ItemOrNull = Item | null;

type RemoveWrapper = {
  isRemoving: boolean,
  removeError : Error | null,
  removedItem: ItemOrNull
}

function DeletionButtonAndPopUp({form, alreadyExists, removeObject, setRemoveObject, onDeletion, afterDeletion}: 
    {
        form: any, 
        alreadyExists: boolean, 
        removeObject: RemoveWrapper,
        setRemoveObject: React.Dispatch<React.SetStateAction<RemoveWrapper>>
        onDeletion: (body?: ChangeItemRequest | undefined) => Promise<any>,
        afterDeletion: (item: ItemOrNull) => void
    }){
        const [isOpen, setIsOpen] = useState<boolean>(false);

        const handleCancel = () => setIsOpen(false);

        // Pop-up to delete the item from the database
        const handleOpen = (removedItem: Item) => {
            setRemoveObject((prev: RemoveWrapper) => ({ ...prev, removedItem }));
            setIsOpen(true)
        };

        const changeRemoveObject = (name: string, value: string | null | Item | boolean) => {
            setRemoveObject((prev: RemoveWrapper) => ({ ...prev, [name]: value }));
        }

        async function handleRemove() {
            if (removeObject.removedItem !== null){
                let response;
                try {
                    response = await onDeletion(createChangeItemRequest(removeObject.removedItem));
                    console.log("response: ", response);
                    changeRemoveObject("removedItem", null);
                    setIsOpen(false);
                    if (response.success != null){
                        afterDeletion(removeObject.removedItem);
                    }
                    else {
                        changeRemoveObject("isRemoving", false);
                    }
                    // e.g. show a success toast, reset form, etc.
                } catch (err) {
                    changeRemoveObject("removeError", err instanceof Error ? err.message : "Something went wrong.");
                } finally {
                    changeRemoveObject("removedItem", null);
                    setIsOpen(false);
                }
            }
        };
        return (
            <>
                <button
                    type="button"
                    onClick={() => handleOpen(form)}
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
            </>
        )
}

export { DeletionButtonAndPopUp }
export type { RemoveWrapper, ItemOrNull }