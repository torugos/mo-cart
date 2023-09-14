import { Products } from "./products.model";

export interface CartList {
    listId: number;
    products: Products[];
}