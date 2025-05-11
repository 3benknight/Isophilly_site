// utils/isoColors.js
import Papa from 'papaparse';

const isoData = {}; 
const minMax  = {}; 

export async function loadIsochroneStats() {
    const res  = await fetch('/data/iso_features.csv');
    const txt  = await res.text();
    const rows = Papa.parse(txt, { header: true, skipEmptyLines: true }).data;
    rows.forEach(row => {
      const [, dist, mode] = row.isochrone.split('-');
      const key            = `${row.center}|${dist}-${mode}`;
      isoData[key]         = row;
      const rangeKeyBase   = `${dist}-${mode}`;
      Object.entries(row).forEach(([col, val]) => {
        if (col === 'isochrone' || col === 'center') return;
        const num = parseFloat(val);
        if (isNaN(num)) return;
        const mk = `${col}|${rangeKeyBase}`;
        if (!minMax[mk]) {
          minMax[mk] = { min: num, max: num };
        } else {
          minMax[mk].min = Math.min(minMax[mk].min, num);
          minMax[mk].max = Math.max(minMax[mk].max, num);
        }
      });
    });
    console.log(minMax);
}

function ratioToColor(ratio) {
  ratio = Math.max(0, Math.min(1, ratio));
  const r = Math.round(255 * (1 - ratio));
  const g = Math.round(255 * ratio);
  const h2 = n => n.toString(16).padStart(2, '0');
  return `#${h2(r)}${h2(g)}00`;
}

/**
 * @param {string} feat           feature to filter
 * @param {object} reg            geojson being styled
 * @param {number} dist           600|1200|1800
 * @param {'foot'|'car'|'pt'} mode
 * @param {string} selectedCenter selected census block
 */
export function getColor(feat, reg, dist, mode, selectedCenter) {
  if (reg.properties.first_iso_center === "no_isochrone") 
    return '#a1a6ab';

  if (reg.id === selectedCenter)             
    return '#33425c';

  if (feat === "none")                       
    return '#97b8d1';

  const isoKey = `${reg.id}|${dist}-${mode}`;
  const row    = isoData[isoKey];
  console.log(isoKey, )
  if (!row) return '#a1a6ab';

  const val = parseFloat(row[feat]);
  if (isNaN(val)) return '#a1a6ab';

  const mm = minMax[`${feat}|${dist}-${mode}`];
  if (!mm || mm.max === mm.min) 
    return '#a1a6ab';

  const ratio = (val - mm.min) / (mm.max - mm.min);
  return ratioToColor(ratio);
}
