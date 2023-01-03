import { OverpassNode } from "overpass-ts";
import { useEffect, useState } from "react";

type ResultPanelProps = {
    elements: Array<OverpassNode>,
    setElements: Function,
    revertChanges: Function,
    nearestPlaceIndex: number,
    setNearestPlaceIndex: Function
}

export default function ResultPanel(props: ResultPanelProps) {
    

    const getRandomPlace = () => {
        const nonOriginPlaces = props.elements.slice(1);
        const randomElement = nonOriginPlaces[nonOriginPlaces.length * Math.random() | 0];
        props.setElements([randomElement]);
    }

    const getNearestPlace = () => {
        props.setElements([props.elements[props.nearestPlaceIndex]]);
        props.setNearestPlaceIndex(props.nearestPlaceIndex + 1);
    }

    return (
        <div className="flex flex-col gap-1 app-control-container">
            <h2>Fonctions</h2>
            <p>Vous pouvez utiliser ces fonctions pour affiner votre recherche</p>
            <div className="flex flex-row gap-2">
                <button className='app-button' onClick={getRandomPlace}>Aléatoire</button>
                <button className='app-button' onClick={getNearestPlace}>J'ai la flemme de marcher</button>
                <button className='app-button' onClick={() => props.revertChanges()}>J'ai tout cassé, reviens au début</button>
            </div>
        </div>
    );
}