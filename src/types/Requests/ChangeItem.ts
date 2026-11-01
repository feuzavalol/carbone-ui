import type { Item } from "../itemTypes";


type ChangeItemRequest = {
  item: Item
}

function createChangeItemRequest(item: Item): ChangeItemRequest{
    return { item };
}

export type { ChangeItemRequest }
export { createChangeItemRequest }