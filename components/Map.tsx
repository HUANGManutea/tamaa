import { useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    GeoJSON,
    CircleMarker,
    LayerGroup,
  } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { OverpassNode } from "overpass-ts";

type MapProps = {
    center: Array<number>,
    elements: Array<OverpassNode>
};

const overpassKeyToString: Record<string, string> = {
    "restaurant": "Fast food",
    "fast_food": "Fast food",
    "pub": "Pub",
    "cafe": "Café",
    "bar": "Bar",
    "ice_cream": "Glace",
    "bakery": "Boulangerie",
    "confectionery": "Pâtisserie",
    "chocolate": "Chocolat",
    "burger": "Burger"
};

const getOverpassKeyToString = (key: string) => {
    if (overpassKeyToString[key]) {
        return overpassKeyToString[key];
    } else {
        return key;
    }
}

const getPopupContent = (element: OverpassNode) => {
    let cuisineHTMLElement = '';
    if (element.tags?.cuisine) {
        cuisineHTMLElement = "<ul>";
        element.tags?.cuisine.split(";").forEach(c => {
            cuisineHTMLElement += `<li>${getOverpassKeyToString(c)}</li>`;
        });
        cuisineHTMLElement +="</ul>";
    }
    //<p><span>Id: </span>${element.id}</p>
    return `
        <div class="flex flex-col gap-1">
            <p><span>Nom: </span>${element.tags!!.name}</p>
            ${element.tags?.amenity ? `<p><span>Type: </span>${getOverpassKeyToString(element.tags?.amenity)}</p>`: ''}
            ${element.tags?.shop ? `<p><span>Boutique: </span>${getOverpassKeyToString(element.tags?.shop)}</p>`: ''}
            ${cuisineHTMLElement === '' ? '' : `<div class="flex flex-col gap-1"><span>Cuisine: </span>${cuisineHTMLElement}</div>`}
        </div>
    `;
}

export default function Map(props: MapProps) {
    const ZOOM_LEVEL = 9;
    const mapRef = useRef();

    let map: L.Map | null = null;
    let layerGroup: L.LayerGroup | null = null;

    const blueIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const redIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    useEffect(() => {
        var container = L.DomUtil.get("map");
        if (container != null) {
            container._leaflet_id = null;
        }
        
        map = new L.Map("map", {
            center: [props.center[0], props.center[1]],
            zoom: 20,
            layers: [
                new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });
        layerGroup = L.layerGroup().addTo(map);
        updateMarkers(layerGroup, props.elements);
    }, [map, props.elements]);

    const updateMarkers = (layerGroup: L.LayerGroup, elements: Array<OverpassNode>) => {
        layerGroup.clearLayers();
        elements.forEach((element, i) => {
            let icon = redIcon;
            if (i === 0) {
                icon = blueIcon;
            }
            const marker = L.marker([element.lat, element.lon], {title: element.tags!!.name, icon: icon})
                .addTo(layerGroup)
                .bindPopup(getPopupContent(element));
        })
    };

    return (
        <div className="flex flex-col flex-grow">
            <div id="map"></div>
        </div>
    );
}