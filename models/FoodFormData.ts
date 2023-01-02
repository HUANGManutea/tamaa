import { OverpassNode } from "overpass-ts";
import { Cuisine } from "./Cuisine";
import { MerchantType } from "./MerchantType";

export interface FoodFormData {
    location: OverpassNode,
    merchantTypes: Array<MerchantType>,
    cuisines: Array<Cuisine>
}