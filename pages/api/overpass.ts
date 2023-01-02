import type { NextApiRequest, NextApiResponse } from 'next'
import { overpass, OverpassNode, OverpassWay } from 'overpass-ts';
import { OverpassQueryData } from '../../models/OverpassQueryData';
import type { OverpassJson } from "overpass-ts";
import { OverpassAPIData } from '../../models/OverpassAPIData';
import cacheData from "memory-cache";

const fetchWithCache = async (formattedQuery: string) : Promise<OverpassJson> => {
  const value = cacheData.get(formattedQuery);
    if (value) {
        return value;
    } else {
        const hours = 24;
        console.log("cache miss, querying overpass API");
        const resOverpass = await overpass(formattedQuery, {
          endpoint: 'http://overpass-api.de/api/interpreter'
        });
        console.log("query done");
        const data = await resOverpass.json() as OverpassJson;
        cacheData.put(formattedQuery, data, hours * 1000 * 60 * 60);
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

const shopList = ['confectionery', 'bakery', 'chocolate', 'mall', 'supermarket'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OverpassAPIData>
) {
  const overpassQueryData: OverpassQueryData = req.body;
  console.log(`received overpassQueryData: ${overpassQueryData}`);
  const rawAmenity = overpassQueryData.amenities.join('|').split('|');
  const amenities = rawAmenity.filter(a => shopList.indexOf(a) === -1).join('|');
  const shops = rawAmenity.filter(a => shopList.indexOf(a) > -1).join('|');
  
  let elements: Array<OverpassNode> = [];

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

  elements = data.elements.filter(e => e.type === "node").map(e => e as OverpassNode).filter(e => e.tags?.name != null);


  const ways: Array<OverpassNode> = data.elements
    .filter(e => e.type === "way")
    .map(e => e as OverpassWay)
    .filter(e => e.tags?.name != null)
    .map(e => {
      const res: OverpassNode = {
        id: e.id,
        type: "node",
        lat: e.center!!.lat,
        lon: e.center!!.lon,
        tags: e.tags
      }
      return res;
    });
  elements.push(...ways);
  
  res.status(200).json({ elements: elements });
}
