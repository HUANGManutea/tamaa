import { useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    GeoJSON,
    CircleMarker,
  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Location } from "../models/Location";

type MapProps = {
    location: Location
};

export default function Map(props: MapProps) {
    const ZOOM_LEVEL = 9;
    const mapRef = useRef();

    return (
        <div className="flex flex-col flex-grow">
            <MapContainer center={[props.location.lat, props.location.long]} zoom={12}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> 
                    contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[props.location.lat, props.location.long]}>
                    <Popup>{props.location.name}</Popup>
                </Marker>
            </MapContainer>
        </div>
        
    );
}