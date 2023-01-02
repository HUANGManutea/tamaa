import dynamic from 'next/dynamic';
import Head from 'next/head'
import { OverpassNode } from 'overpass-ts';
import { useState } from 'react'
import FoodForm from '../components/FoodForm'
import { OverpassAPIData } from '../models/OverpassAPIData';


const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [apiData, setApiData] = useState<OverpassAPIData | null>(null);
  const [location, setLocation] = useState<OverpassNode | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [radius, setRadius] = useState<number>(300);
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
          <FoodForm setApiData={setApiData} setLocation={setLocation} radius={radius} setRadius={setRadius} setLoading={setLoading}></FoodForm>
          {apiData && location ?
            <Map center={[location.lat, location.lon]} elements={apiData.elements} radius={radius}></Map> // we have data
            :
            loading ?
                <div className='flex flex-row flex-grow h-screen justify-center items-center gap-2'>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className='text-center'>Chargement</p>
                </div> // we are fetching data
              :
              <div className='flex flex-col flex-grow justify-center'>
                <p className='text-center'>Cliquez sur "Chercher"</p>
                </div> // no fetch and no data
              
            }
        </div>
      </div>
    </>
  )
}
