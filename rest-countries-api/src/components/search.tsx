import { ChangeEvent } from "preact/compat";
import { region, searchQuery } from "../state/search-signal";
import { CountriesList } from "./countries-list";
import { Region } from "../types";

export function Search() {

  function handleRegionSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    region.value = event.currentTarget?.value as Region;
  }

  function handleNameInputKeyUp(event: ChangeEvent<HTMLInputElement>) {
    searchQuery.value = event.currentTarget?.value;
  }

  return (
    <>
      <input type="text" value={searchQuery.value} onKeyUp={handleNameInputKeyUp}/>
      <select name="region" value={region.value} id="region" onChange={handleRegionSelectChange}>
        <option value="all">All</option>
        <option value="africa">Africa</option>
        <option value="america">America</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
        <option value="oceania">Oceania</option>
      </select>
      <CountriesList></CountriesList>
    </>
  )
}  