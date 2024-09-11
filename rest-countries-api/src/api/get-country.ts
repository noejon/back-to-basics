import { BASE_API, NAME } from "./constants";

export async function getCountry(name: string) {
  const endpoint = BASE_API + NAME + '/' + name;

  const response = await fetch(endpoint);
  const [countryJson] = await response.json();

  return countryJson;
}