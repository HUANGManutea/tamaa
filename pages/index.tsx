import dynamic from 'next/dynamic';
import Head from 'next/head'
import { useEffect, useState } from 'react'
import FoodForm from '../components/FoodForm'
import { FoodFormData } from '../models/FoodFormData';


const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [foodFormData, setFoodFormData] = useState<FoodFormData | null>(null);

  useEffect(() => {
    console.log(foodFormData);
  }, [foodFormData])
  return (
    <>
      <Head>
        <title>Tamaa</title>
        <meta name="description" content="Où est-ce qu'on mange?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col justify-between min-h-screen m-auto p-5 sm:p-20 gap-5'>
        <FoodForm foodFormData={foodFormData} setFoodFormData={setFoodFormData}></FoodForm>
        {foodFormData ? <Map location={foodFormData.location}></Map>: <></>}
      </div>
    </>
  )
}
