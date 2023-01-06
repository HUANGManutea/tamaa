import { Switch } from '@headlessui/react';
import Head from 'next/head'
import { useState } from 'react'
import GoogleMapView from '../components/GoogleMapView';
import OpenStreetMapView from '../components/OpenStreetMapView';


export default function Home() {
  const [isGoogleMaps, setIsGoogleMaps] = useState<boolean>(true);


  return (
    <>
      <Head>
        <title>Tamaa</title>
        <meta name="description" content="Où est-ce qu'on mange?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col h-full gap-5'>
        <h1 className='text-2xl text-center'>Tama'a</h1>
        <div className='flex flex-col h-full mx-auto gap-5 sm:m-0 sm:px-20'>
          <div className='flex flex-row justify-center'>
            <Switch.Group>
                <div className="flex justify-between">
                    <Switch.Label className="mr-4">Open Street Map</Switch.Label>
                    <Switch
                        checked={isGoogleMaps}
                        onChange={() => setIsGoogleMaps(!isGoogleMaps)}
                        className={`${
                          isGoogleMaps ? 'bg-blue-600' : 'bg-black'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}>
                        <span
                        className={`${
                          isGoogleMaps ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                    <Switch.Label className="ml-4">Google Maps</Switch.Label>
                </div>
            </Switch.Group>
          </div>
          {isGoogleMaps ? <GoogleMapView></GoogleMapView> : <OpenStreetMapView></OpenStreetMapView>}
        </div>
      </div>
    </>
  )
}
