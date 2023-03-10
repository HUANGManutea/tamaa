import { Listbox, Transition, Switch } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { OverpassNode } from 'overpass-ts';
import { Fragment, useState } from 'react';
import { FoodFormData } from '../models/FoodFormData';
import { Option } from '../models/Option';
import { OverpassAPIData } from '../models/OverpassAPIData';
import { OverpassQueryData } from '../models/OverpassQueryData';
import Slider from './Slider';

import {initialLocations, initialAmenities, initialFoodCategories} from '../models/InitialData';

type FoodFormProps = {
    setApiData: Function,
    setLocation: Function,
    radius: number,
    setRadius: Function,
    setLoading: Function
}

const updateOptionArray = (option: Option, originalOptions: Array<Option>) => {
    const copyOptions: Array<Option> = JSON.parse(JSON.stringify(originalOptions));
    const foundOption = copyOptions.find(o => o.type === option.type);
    if (foundOption) {
        foundOption.enabled = !foundOption.enabled;
    }
    return copyOptions;
}

const foodFormToOverpassQueryData = (foodFormData: FoodFormData, radius: number): OverpassQueryData => {
    let cuisines : Array<Option> = [];
    if (foodFormData.cuisines.length !== initialFoodCategories.length) {
        cuisines = foodFormData.cuisines;
    }
    const res: OverpassQueryData = {
        location: foodFormData.location,
        radius: radius,
        amenities: foodFormData.merchantTypes.map(m => m.type),
        cuisines: cuisines.map(c => c.type)
    };
    
    return res;
}

const renderCuisineSelection = (cuisines: Array<Option>, setEnabledCuisines: Function) => {
    if (cuisines.length === 0) return <></>;
    return (
        <div className="flex flex-col gap-2">
            <span>Quel type de cuisine ?</span>
            <div className="flex flex-row">
                <div className="flex flex-col gap-2">
                    {cuisines.map((cuisine,cuisineIdx) => (
                        <Switch.Group key={`cuisine-${cuisineIdx}`}>
                            <div className="flex justify-between">
                                <Switch.Label className="mr-4">{cuisine.name}</Switch.Label>
                                <Switch
                                    checked={cuisine.enabled}
                                    onChange={() => setEnabledCuisines(cuisine)}
                                    className={`${
                                        cuisine.enabled ? 'bg-blue-600' : 'bg-black'
                                    } relative inline-flex h-6 w-11 items-center rounded-full`}>
                                    <span
                                    className={`${
                                        cuisine.enabled ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </Switch>
                            </div>
                        </Switch.Group>
                        ))}
                </div>
                <div className='flex flex-grow'></div>
            </div>
        </div>
    );
}

export default function FoodForm(props: FoodFormProps) {
    const [selectedLocation, setSelectedLocation] = useState(initialLocations[0]);
    const [merchantTypes, setMerchantTypes] = useState<Array<Option>>(initialAmenities);
    const [cuisines, setCuisines] = useState<Array<Option>>(initialFoodCategories);

    const submitFoodForm = async (event: any) => {
        event.preventDefault();
        props.setLoading(true);
        const foodFormData = {
            location: selectedLocation,
            merchantTypes: merchantTypes.filter(m => m.enabled),
            cuisines: cuisines.filter(c => c.enabled)
        };
        const body = JSON.stringify(foodFormToOverpassQueryData(foodFormData, props.radius));
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/overpass`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        })
        let data = await res.json() as OverpassAPIData;
        data.elements = [selectedLocation, ... data.elements];
        console.log(data);
        props.setApiData(data);
        props.setLocation(selectedLocation);
        props.setLoading(false);
    }

    const setEnabledMerchantType = (option: Option) => {
        const copyOptions = updateOptionArray(option, merchantTypes);
        setMerchantTypes(copyOptions);
    }

    const setEnabledCuisines = (option: Option) => {
        const copyCuisines = updateOptionArray(option, cuisines);
        setCuisines(copyCuisines);
    }

    return (
        <form onSubmit={submitFoodForm} className="app-control-container">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <span>O?? es-tu ?</span>
                    <Listbox value={selectedLocation} onChange={setSelectedLocation}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-black py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <span className="block truncate">{selectedLocation.tags?.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10  mt-1 max-h-60 w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {initialLocations.map((location, locationIdx) => (
                                    <Listbox.Option
                                    key={`location-${locationIdx}`}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-gray-800 text-white-200' : 'text-white'
                                        }`
                                    }
                                    value={location}
                                    >
                                    {({ selected }) => (
                                        <>
                                        <span
                                            className={`block truncate ${
                                            selected ? 'font-medium' : 'font-normal'
                                            }`}
                                        >
                                            {location.tags?.name}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                        </>
                                    )}
                                    </Listbox.Option>
                                ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Quelle distance max ?</span>
                    <Slider value={props.radius} setValue={props.setRadius}></Slider>
                </div>

                <div className="flex flex-col gap-2">
                    <span>Type de lieu ?</span>
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-2">
                            {merchantTypes.map((merchantType, merchantTypeIdx) => (
                                <Switch.Group key={`merchantType-${merchantTypeIdx}`}>
                                    <div className="flex justify-between">
                                        <Switch.Label className="mr-4">{merchantType.name}</Switch.Label>
                                        <Switch
                                            checked={merchantType.enabled}
                                            onChange={() => setEnabledMerchantType(merchantType)}
                                            className={`${
                                                merchantType.enabled ? 'bg-blue-600' : 'bg-black'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}>
                                            <span
                                            className={`${
                                                merchantType.enabled ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                            />
                                        </Switch>
                                    </div>
                                </Switch.Group>
                            ))}
                        </div>
                        <div className='flex flex-grow'></div>
                    </div>
                </div>
                {renderCuisineSelection(cuisines, setEnabledCuisines)}
                
                <div className='flex flex-col items-center'>
                    <button type="submit" className='app-button'>Chercher</button>
                </div>
            </div>
        </form>
    )
}