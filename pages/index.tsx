import dynamic from 'next/dynamic';
import Head from 'next/head'
import { OverpassJson, OverpassNode } from 'overpass-ts';
import { useEffect, useState } from 'react'
import FoodForm from '../components/FoodForm'
import { FoodFormData } from '../models/FoodFormData';
import { OverpassAPIData } from '../models/OverpassAPIData';


const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [apiData, setApiData] = useState<OverpassAPIData | null>(null);
  const [location, setLocation] = useState<OverpassNode | null>(null);
  return (
    <>
      <Head>
        <title>Tamaa</title>
        <meta name="description" content="Où est-ce qu'on mange?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col gap-5'>
        <h1 className='text-2xl text-center'>Tama'a</h1>
        <div className='flex flex-col sm:flex-row justify-between min-h-screen mx-auto sm:m-0 sm:px-20 gap-5'>
          <FoodForm apiData={apiData} setApiData={setApiData} location={location} setLocation={setLocation}></FoodForm>
          {apiData && location ? <Map center={[location.lat, location.lon]} elements={apiData.elements}></Map>: <></>}
        </div>
      </div>
    </>
  )
}
