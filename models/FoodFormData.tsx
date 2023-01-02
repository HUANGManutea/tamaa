import { Cuisine } from "./Cuisine";
import { Location } from "./Location";
import { MerchantType } from "./MerchantType";

export interface FoodFormData {
    location: Location,
    merchantTypes: Array<MerchantType>,
    cuisines: Array<Cuisine>
}