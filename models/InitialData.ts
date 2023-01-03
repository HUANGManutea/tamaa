import { Option } from "./Option";
import { OverpassNodeExt } from "./OverpassNodeExt";

export const initialLocations: Array<OverpassNodeExt> = [
    {id: 1, type: "node", lat: -17.54234, lon: -149.56831, tags: {name: "Tereva"}, dist: 0},
    {id: 2, type: "node", lat: -17.55303, lon: -149.59150, tags: {name: "Pamatai"}, dist: 0},
    {id: 2, type: "node", lat: -17.5418578, lon: -149.5716090, tags: {name: "Bruat"}, dist: 0},
    {id: 3, type: "node", lat: -17.54314, lon: -149.56808, tags: {name: "Attique"}, dist: 0},
];

export const initialFoodCategories: Array<Option> = [
    // {name: "Burger", enabled: true, type: "burger"}
];

export const initialAmenities: Array<Option> = [
    {name: "Restaurant", type: "restaurant", enabled: true},
    {name: "Fast food", type: "fast_food", enabled: true},
    {name: "Pub", type: "pub", enabled: true},
    {name: "Café", type: "cafe", enabled: true},
    {name: "Bar", type: "bar", enabled: true},
    {name: "Glace", type: "ice_cream", enabled: true},
    {name: "Boulangerie/Pâtisserie", type: "bakery|confectionery", enabled: true},
    {name: "Magasin", type: "mall|supermarket", enabled: true},
    {name: "Chocolat", type: "chocolate", enabled: true},
];