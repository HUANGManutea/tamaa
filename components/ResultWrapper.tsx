import dynamic from "next/dynamic";
import { OverpassNodeExt } from "../models/OverpassNodeExt";
import ResultPanel from "./ResultPanel";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

type ResultWrapperProps = {
    location: OverpassNodeExt,
    radius: number,
    elements: Array<OverpassNodeExt>,
    setElements: Function,
    memoryElements: Array<OverpassNodeExt>,
    revertChanges: Function,
    nearestPlaceIndex: number,
    setNearestPlaceIndex: Function
}

export default function ResultWrapper(props: ResultWrapperProps) {
    return (
        <div className="flex flex-col flex-grow gap-2">
            <Map center={[props.location.lat, props.location.lon]} elements={props.elements} radius={props.radius}></Map>
            <ResultPanel elements={props.memoryElements} setElements={props.setElements} nearestPlaceIndex={props.nearestPlaceIndex} setNearestPlaceIndex={props.setNearestPlaceIndex} revertChanges={props.revertChanges}></ResultPanel>
        </div>
    )
}