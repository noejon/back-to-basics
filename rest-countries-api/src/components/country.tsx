import { useRoute } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import { getCountry } from "../api/get-country";

export function Country() {
  const [country, setCountry] = useState();
  const {params} = useRoute();

  useEffect(function() {
    (async() => {
      const countryJson = await getCountry(params.name);
      console.log(countryJson);
      setCountry(countryJson);
    })()
  }, [params.name])

  return <>Name: {country?.name.common}</>
}