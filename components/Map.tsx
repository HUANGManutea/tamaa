import { useRef } from "react";
import { MapContainer } from "react-leaflet";
import { Position } from "../models/Position"

type MapProps = {
    center: Position
}

export default function Map(props: MapProps) {
    const ZOOM_LEVEL = 9;
    const mapRef = useRef();

    return (
        <MapContainer zoom={ZOOM_LEVEL} ref={mapRef}></MapContainer>
    );
}