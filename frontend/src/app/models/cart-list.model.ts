import { Time } from "@angular/common";
import { Products } from "./products.model";

export interface CartList {
    id: number;
    listName: string;
    dateTime: Time;
    products: Products[];
}