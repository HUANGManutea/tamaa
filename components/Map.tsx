import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import {initialLocations} from '../models/InitialData';
import { OverpassNodeExt } from "../models/OverpassNodeExt";

type MapProps = {
    center: Array<number>,
    radius: number,
    elements: Array<OverpassNodeExt>
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

const getPopupContent = (element: OverpassNodeExt) => {
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
        iconUrl: "../assets/markerIconBlue.png",
        shadowUrl: '../assets/markerShadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const redIcon = new L.Icon({
        iconUrl: "../assets/markerIconRed.png",
        shadowUrl: '../assets/markerShadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const getIcon = (element: OverpassNodeExt) => {
        if (initialLocations.find(node => node.tags?.name === element.tags?.name)) {
            return blueIcon;
        }
        return redIcon;
    }

    useEffect(() => {
        var container = L.DomUtil.get("map");
        if (container != null) {
            container._leaflet_id = null;
        }
        
        map = new L.Map("map", {
            center: [props.center[0], props.center[1]],
            zoom: 16,
            scrollWheelZoom: false,
            layers: [
                new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                })
            ]
        });
        layerGroup = L.layerGroup().addTo(map);
        updateMarkers(layerGroup, props.elements);
    }, [map, props.elements, props.center]);

    const updateMarkers = (layerGroup: L.LayerGroup, elements: Array<OverpassNodeExt>) => {
        layerGroup.clearLayers();
        elements.forEach((element) => {
            L.marker([element.lat, element.lon], {title: element.tags!!.name, icon: getIcon(element)})
                .addTo(layerGroup)
                .bindPopup(getPopupContent(element));
        })
        L.circle([props.center[0], props.center[1]]).setRadius(props.radius).addTo(layerGroup);
    };

    return (
        <div className="flex flex-col">
            <div id="map"></div>
        </div>
    );
}