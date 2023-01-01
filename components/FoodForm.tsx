import { Listbox, Transition, Combobox, Switch } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';
import { FoodFormData } from '../models/FoodFormData';
import { Location } from '../models/Location';
import { Option } from '../models/Option';

type FoodFormProps = {
    foodFormData: FoodFormData | null,
    setFoodFormData: Function,
}

const locations: Array<Location> = [
    {name: "Tereva", lat: 0, long: 0},
    {name: "Pamatai", lat: 0, long: 0},
    {name: "Attique", lat: 0, long: 0},
];

// const FoodCategories: Array<string> = [
//     "burger"
// ];

const updateOptionArray = (option: Option, originalOptions: Array<Option>) => {
    const copyOptions: Array<Option> = JSON.parse(JSON.stringify(originalOptions));
    const foundOption = copyOptions.find(o => o.type === option.type);
    if (foundOption) {
        foundOption.enabled = !foundOption.enabled;
    }
    return copyOptions;
}

export default function FoodForm(props: FoodFormProps) {
    const [selectedLocation, setSelectedLocation] = useState(locations[0]);
    const [merchantTypes, setMerchantTypes] = useState<Array<Option>>([
        {name: "Sur place", type: "restaurant", enabled: true},
        {name: "A emporter", type: "fast_food", enabled: true},
    ]);
    const [cuisines, setCuisines] = useState<Array<Option>>([
        {name: "Burger", enabled: true, type: "burger"}
    ]);

    const submitFoodForm = (event: any) => {
        event.preventDefault();
        props.setFoodFormData({
            location: selectedLocation,
            merchantTypes: merchantTypes.filter(m => m.enabled),
            cuisines: cuisines.filter(c => c.enabled)
        })
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
        <form onSubmit={submitFoodForm} className="rounded px-8 pt-6 pb-8 mb-4 border border-white bg-gray-700">
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <span>Où es-tu ?</span>
                    <Listbox value={selectedLocation} onChange={setSelectedLocation}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-black py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <span className="block truncate">{selectedLocation.name}</span>
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
                                {locations.map((location, locationIdx) => (
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
                                            {location.name}
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
                    <span>Sur place ? A emporter ?</span>
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
                
                <div className='flex flex-col items-center'>
                    <button type="submit" className='app-button'>Chercher</button>
                </div>
            </div>
        </form>
    )
}