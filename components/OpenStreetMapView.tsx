import { useState } from "react";
import { OverpassAPIData } from "../models/OverpassAPIData";
import { OverpassNodeExt } from "../models/OverpassNodeExt";
import FoodForm from "./FoodForm"
import ResultWrapper from "./ResultWrapper"


type OpenStreetMapViewProps = {}

export default function OpenStreetMapView(props: OpenStreetMapViewProps) {
    const [apiData, setApiData] = useState<OverpassAPIData | null>(null);
    const [location, setLocation] = useState<OverpassNodeExt | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [radius, setRadius] = useState<number>(300);
    const [memoryApiData, setMemoryApiData] = useState<OverpassAPIData>({} as OverpassAPIData);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [nearestPlaceIndex, setNearestPlaceIndex] = useState<number>(1);
    
    const setElements = (elements: Array<OverpassNodeExt>) => {
        if (initialized) {
            setApiData({
                ...apiData,
                elements: elements
            });
        }
    }
    
    const setProxyApiData = (data: OverpassAPIData) => {
        setApiData(data);
        const copyApiData: OverpassAPIData = JSON.parse(JSON.stringify(data));
        setMemoryApiData(copyApiData);
        setInitialized(true);
    }
    
    const revertChanges = () => {
        if (initialized) {
            setNearestPlaceIndex(1);
            setApiData(memoryApiData);
        }
    }
    return (
        <div className='flex flex-col sm:flex-row justify-between h-full'>
        <FoodForm setApiData={setProxyApiData} setLocation={setLocation} radius={radius} setRadius={setRadius} setLoading={setLoading}></FoodForm>
        {apiData && location ?
            <ResultWrapper location={location} elements={apiData.elements} memoryElements={memoryApiData.elements} radius={radius} setElements={setElements} nearestPlaceIndex={nearestPlaceIndex} setNearestPlaceIndex={setNearestPlaceIndex} revertChanges={revertChanges}></ResultWrapper> // we have data
            :
            loading ?
            <div className='flex flex-row grow h-screen justify-center items-center gap-2'>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className='text-center'>Chargement</p>
            </div> // we are fetching data
            :
            <div className='flex flex-col grow justify-center'>
            <p className='text-center'>Cliquez sur "Chercher"</p>
            </div> // no fetch and no data
        }
        </div>
        )
    }