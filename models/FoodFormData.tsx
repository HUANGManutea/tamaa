import { Cuisine } from "./Cuisine";
import { MerchantType } from "./MerchantType";

export interface FoodFormData {
    location: Location,
    merchantTypes: Array<MerchantType>,
    cuisines: Array<Cuisine>
}