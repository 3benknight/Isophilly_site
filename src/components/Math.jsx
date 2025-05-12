import censusBlocks from "../assets/data/census_blocks.json";

export function hasIsochrone(coords) {
    return censusBlocks.features.find(group => group.id === coords).properties.first_iso_center !== "no_isochrone"
}

function twoDigitGroup(coords) {
    const [lat] = coords.split(',');
    const abs = Math.abs(parseFloat(lat)).toFixed(8);
    const [intPart, decPart] = abs.split('.');
    return `${intPart}_${decPart.slice(0,2)}`;
  }

  export async function findIsochrone(coords, dist, mode) {
    if (coords === "none") return null;
  
    const group = twoDigitGroup(coords);
    const fileName = `tens${dist}ft_${mode}_${group}.json`;
    const url = `${process.env.PUBLIC_URL}/data/isochrones/${fileName}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Isochrone not found: ${url} → ${res.status}`);
        return null;
      }
      const geojson = await res.json();
      console.log(geojson.features.find(f => f.properties.center === coords));
      return geojson.features.find(f => f.properties.center === coords) || null;
    } catch (err) {
      console.error("Failed loading isochrone:", err);
      return null;
    }
  }
