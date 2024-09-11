import { Country, Region } from "../types";
import { ALL, BASE_API, REGION } from "./constants";

export async function filterCountries(searchQuery: string, region: Region) {
  const serviceToCall = region === 'all' ? ALL : REGION + '/' + region;
  const endpoint = BASE_API + serviceToCall + '?fields=name,flags,population,region,capital';

  const response = await fetch(endpoint);
  const countriesJson = await response.json();

  return countriesJson.filter((country: Country) => country.name.common.toLowerCase().includes(searchQuery.toLowerCase()));
}