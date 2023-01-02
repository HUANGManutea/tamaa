import { useState } from "react";

type SliderProps = {
    value: number,
    setValue: Function
}

export default function Slider(props: SliderProps) {
    const min = 0;
    const max = 1000;

    const onChange = (event: any) => {
        props.setValue(event.target.value);
    }

    return (
        <div className="rounded-lg max-w-[300px]">
        <div className="price-range">
            <span className="text-sm">{props.value}</span>
            <span className="text-sm"> mètres</span>
            <input className="w-full blue-600" type="range" name="" value={props.value} min={min} max={max} step={50} onChange={onChange}/>
            <div className="-mt-2 flex w-full justify-between">
            <span className="text-sm text-white">{min}</span>
            <span className="text-sm text-white">{max}</span>
            </div>
        </div>
        </div>
    );
}