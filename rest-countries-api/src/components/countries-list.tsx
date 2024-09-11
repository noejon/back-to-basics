import { useEffect, useState } from "preact/hooks"
import { region, searchQuery } from "../state/search-signal";
import { filterCountries } from "../api/filter-countries";
import { Countries } from "../types";

export function CountriesList() {
  const [countries, setCountries] = useState<Countries | null>(null);  

  useEffect(function() {
    let debounceTimer: number;

    debounceTimer = setTimeout(async () => {
      const countriesJson = await filterCountries(searchQuery.value, region.value);
      setCountries(countriesJson);
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    }
  }, [region.value, searchQuery.value]);

  return <ul>
    {countries?.map(function(country) {
      return <li>
        <a href={`/country/${country.name.common}`}>
          <div class="card">
            <img class="flag" src={country.flags.svg} alt={country.flags.alt} />
            <p>Name: {country.name.common}</p>
            <p>Capital: {country.capital.length === 1 ? country.capital[0] : <ul>{country.capital.map((capital) => <li>{capital}</li> )}</ul>}</p>
            <p>Population: {country.population}</p>
          </div>
        </a>
      </li>
    })}
  </ul>
}