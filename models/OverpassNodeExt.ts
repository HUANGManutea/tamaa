import { OverpassNode } from "overpass-ts";

export type OverpassNodeMoreProps = {
    dist: number
}

export type OverpassNodeExt = OverpassNode & OverpassNodeMoreProps