import { OverpassNode } from "overpass-ts";

export interface OverpassQueryData {
    location: OverpassNode,
    radius: number,
    amenities: Array<string>,
    cuisines: Array<string>
}