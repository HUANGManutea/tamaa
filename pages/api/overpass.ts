import type { NextApiRequest, NextApiResponse } from 'next'
import { overpass, OverpassNode, OverpassWay } from 'overpass-ts';
import { OverpassQueryData } from '../../models/OverpassQueryData';
import type { OverpassJson } from "overpass-ts";
import { OverpassAPIData } from '../../models/OverpassAPIData';
import cacheData from "memory-cache";
import { HttpsProxyAgent } from 'https-proxy-agent';
import { OverpassNodeExt } from '../../models/OverpassNodeExt';

const fetchWithCache = async (formattedQuery: string) : Promise<OverpassJson> => {
  const value = cacheData.get(formattedQuery);
    if (value) {
      return value;
    } else {
      console.log("cache miss, querying overpass API");
      // prepare options
      let options = {
        method: "POST",
        headers: {
          "Accept": "*"
        },
        body: `data=${encodeURIComponent(formattedQuery)}`
      };
      // add agent if proxy is defined
      if (process.env.HTTPS_PROXY) {
        const baseFetchOptions: any = {};
        baseFetchOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
        options = {
          ...baseFetchOptions,
          ...options,
        }
      }
      
      // call the API
      const resOverpass = await fetch('https://overpass-api.de/api/interpreter', options);
        
      console.log("query done");
      const data = await resOverpass.json() as OverpassJson;
      cacheData.put(formattedQuery, data, 24 * 1000 * 60 * 60);
      return data;
    }
}

const getNodeQuery = (data: OverpassQueryData, amenities: string | null = null, shops: string | null = null) => {
  if (amenities != null) {
    if (data.cuisines.length === 0) {
      return `node(around:${data.radius}, ${data.location.lat}, ${data.location.lon})[amenity~"${amenities}"];out;`;
    } else {
      const cuisines = data.cuisines.join("|");
      return `node(around:${data.radius}, ${data.location.lat}, ${data.location.lon})[amenity~"${amenities}"][cuisine~"${cuisines}"];out;`;
    }
  } else if (shops != null) {
    return `node(around:${data.radius}, ${data.location.lat}, ${data.location.lon})[shop~"${shops}"];out;`;
  } else {
    return '';
  }
}

const getWayQuery = (data: OverpassQueryData, amenities: string | null = null, shops: string | null = null) => {
  if (amenities != null) {
    if (data.cuisines.length === 0) {
      return `way(around:${data.radius}, ${data.location.lat}, ${data.location.lon})[amenity~"${amenities}"];out center;`;
    } else {
      const cuisines = data.cuisines.join("|");
      return `way(around:${data.radius}, ${data.location.lat}, ${data.location.lon})[amenity~"${amenities}"][cuisine~"${cuisines}"];out center;`;
    }
  } else if (shops != null) {
    return `way(around:${data.radius}, ${data.location.lat}, ${data.location.lon})[shop~"${shops}"];out center;`;
  } else {
    return '';
  }
}

export const computeDistance = (origin: OverpassNode, destLat: number, destLon: number): number => {
  // maps don't work like that, the earth is not flat, but eh, it is good enough
  const absLatOrigin = Math.abs(origin.lat);
  const absLonOrigin = Math.abs(origin.lon);

  const absLatNode = Math.abs(destLat);
  const absLonNode = Math.abs(destLon);
  const minLat = Math.min(absLatOrigin, absLatNode);
  const minLon = Math.min(absLonOrigin, absLonNode);
  const maxLat = Math.max(absLatOrigin, absLatNode);
  const maxLon = Math.max(absLonOrigin, absLonNode);
  return Math.sqrt(
      ((maxLat - minLat) * (maxLat - minLat))
      + ((maxLon - minLon) * (maxLon - minLon))
  )
}

const shopList = ['confectionery', 'bakery', 'chocolate', 'mall', 'supermarket'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OverpassAPIData>
) {
  const overpassQueryData: OverpassQueryData = req.body;
  console.log(`received overpassQueryData`);
  const rawAmenity = overpassQueryData.amenities.join('|').split('|');
  const amenities = rawAmenity.filter(a => shopList.indexOf(a) === -1).join('|');
  const shops = rawAmenity.filter(a => shopList.indexOf(a) > -1).join('|');
  
  let elements: Array<OverpassNodeExt> = [];

  // build node queries
  const formattedNodeQueryAmenities = getNodeQuery(overpassQueryData, amenities);
  const formattedNodeQueryShops = getNodeQuery(overpassQueryData, null, shops);

  // build way queries
  const formattedWayQueryAmenities = getWayQuery(overpassQueryData, amenities);
  const formattedWayQueryShops = getWayQuery(overpassQueryData, null, shops);

  const formattedQuery = `[out:json];${formattedNodeQueryAmenities}${formattedNodeQueryShops}${formattedWayQueryAmenities}${formattedWayQueryShops}`;
  // console.log(formattedQuery);
  const data = await fetchWithCache(formattedQuery);
  console.log(`received data from overpass API: ${data}`);

  elements = data.elements.filter(e => e.type === "node" && e.tags?.name != null)
    .map(e => {
      const tempE = e as OverpassNode;
      const res: OverpassNodeExt = {
        id: e.id,
        type: "node",
        lat: tempE.lat,
        lon: tempE.lon,
        tags: e.tags,
        dist: computeDistance(overpassQueryData.location, tempE.lat, tempE.lon)
      }
      return res;
    });


  const ways: Array<OverpassNodeExt> = data.elements
    .filter(e => e.type === "way")
    .map(e => e as OverpassWay)
    .filter(e => e.tags?.name != null)
    .map(e => {
      const res: OverpassNodeExt = {
        id: e.id,
        type: "node",
        lat: e.center!!.lat,
        lon: e.center!!.lon,
        tags: e.tags,
        dist: computeDistance(overpassQueryData.location, e.center!!.lat, e.center!!.lon)
      }
      return res;
    });
  elements.push(...ways);

  elements.sort((a: OverpassNodeExt,b: OverpassNodeExt) => a.dist - b.dist);
  
  res.status(200).json({ elements: elements });
}
