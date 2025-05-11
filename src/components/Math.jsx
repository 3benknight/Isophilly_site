import censusBlocks from "../assets/data/census_blocks.json";
import Papa from 'papaparse';

export function isSameCoords(x1, y1, coords) {
    let saved = coords.split(", ");
    x1 = x1.replace(/[\+\-]/g, '');
    y1 = y1.replace(/[\+\-]/g, '');
    coords = coords.replace(/[\+\-]/g, '');
    let x2 = saved[0];
    let y2 = saved[1];
    return Number.parseFloat(x1).toFixed(2) === Number.parseFloat(x2).toFixed(2) && 
        (-1 * Number.parseFloat(y1).toFixed(2)) === 1 * Number.parseFloat(y2).toFixed(2);
}

export function filterIsochrones(cell, iso, error) {
    let cell_coords = cell.split(",");
    let iso_coords = iso.split(",");
    return Number.parseFloat(cell_coords[0]).toFixed(error) === Number.parseFloat(iso_coords[0]).toFixed(error)
    && Number.parseFloat(cell_coords[1]).toFixed(error) === Number.parseFloat(iso_coords[1]).toFixed(error)
}

export function getIsochrone(selectedIso, currentIso) {
    return Number.parseFloat(currentIso.geoid) === Number.parseFloat(selectedIso[0]) 
        && Number.parseFloat(currentIso.time_limit) === Number.parseFloat(selectedIso[1])
        && currentIso.profile === selectedIso[2]
        && currentIso.point_label === "center";
}

export function hasIsochrone(coords) {
    return censusBlocks.features.find(group => group.id === coords).properties.first_iso_center !== "no_isochrone"
}

function twoDigitGroup(coords) {
    // take the lat portion, absolute value, then grab "39" and "98"
    const [lat] = coords.split(',');
    const abs = Math.abs(parseFloat(lat)).toFixed(8); // "39.96876598"
    const [intPart, decPart] = abs.split('.');
    return `${intPart}_${decPart.slice(0,2)}`;        // "39_96", etc.
  }
  
  /**
   * coords: "lat,lon"
   * dist: 600|1200|1800
   * mode: "walk"|"pt"
   */
  export async function findIsochrone(coords, dist, mode) {
    if (coords === "none") return null;
  
    const group = twoDigitGroup(coords);
    // match the filenames you’ve generated:
    //   600ft_walk_39_96.json   OR   1200ft_pt_39_98.json
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
      // find the one feature whose center exactly equals coords
      return geojson.features.find(f => f.properties.center === coords) || null;
    } catch (err) {
      console.error("Failed loading isochrone:", err);
      return null;
    }
  }
  
  export function getColor(feat, reg, dist, mode, selectedCenter) {
    if(reg.properties.first_iso_center === "no_isochrone")
      return '#a1a6ab';
    if(reg.id === selectedCenter)
      return '#33425c';
    if(feat === "none")
      return '#97b8d1';
    return '#a1a6ab';
  }
  