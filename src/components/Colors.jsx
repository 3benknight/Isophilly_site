import Papa from 'papaparse';

const isoData = {}; 
const minMax  = {}; 

export async function loadIsochroneStats() {
  const csvUrl = `${process.env.PUBLIC_URL}/data/iso_features.csv`;
  console.log('Fetching CSV from', csvUrl);
  const res = await fetch(csvUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${csvUrl}: ${res.status} ${res.statusText}`);
  }
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

export function getColor(feat, reg, dist, mode, selectedCenter) {
  if (reg.properties.first_iso_center === "no_isochrone") 
    return '#a1a6ab';

  if (reg.id === selectedCenter)             
    return '#33425c';

  if (feat === "none")                       
    return '#97b8d1';

  const isoKey = `${reg.id}|${dist}-${mode}`;
  const row    = isoData[isoKey];
  if (!row) return '#a1a6ab';

  if(row[feat] === "True")
    return "#58bf5f";
  if(row[feat] === "False")
    return "#912013";
  const val = parseFloat(row[feat]);
  if (isNaN(val)) return '#a1a6ab';

  const mm = minMax[`${feat}|${dist}-${mode}`];
  if (!mm || mm.max === mm.min) 
    return '#a1a6ab';

  let ratio;
  if(feat === "avg_housing_price") {
    const v    = Math.log(val);
    const vMin = Math.log(mm.min);
    const vMax = Math.log(mm.max);
    const raw  = (v - vMin) / (vMax - vMin);
    ratio = Math.max(0, Math.min(1, raw));
  }
  else
   ratio = (val - mm.min) / (mm.max - mm.min);
  return ratioToColor(ratio);
}

export function getFeatureValue(feat, center, dist, mode) {
  if (feat === 'none') return "None";

  const key = `${center}|${dist}-${mode}`;
  const row = isoData[key];
  if (!row) return "None";

  if(row[feat] === "True" || row[feat] === "False")
    return row[feat];

  const num = parseFloat(row[feat]);
  return Number.isNaN(num) ? "None" : (feat === "foreclosure_over_area") ? num.toFixed(8).toString(): num.toFixed(4).toString();
}
