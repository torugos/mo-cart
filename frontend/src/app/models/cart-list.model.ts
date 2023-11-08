import { Products } from "./products.model";

export interface CartList {
    id: number;
    listName: string;
    dateTime: string;
    products: Products[];
    total: number;
    market: string;
}