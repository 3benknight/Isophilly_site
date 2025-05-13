import Papa from 'papaparse';

const isoData    = {};
const censusData = {};
const minMax     = {};

export async function loadIsochroneStats(spatial) {
  Object.keys(isoData).forEach(k => delete isoData[k]);
  Object.keys(censusData).forEach(k => delete censusData[k]);
  Object.keys(minMax).forEach(k => delete minMax[k]);

  const fileName = spatial === 'Census Block'
    ? 'census_features.csv'
    : 'iso_features.csv';
  const csvUrl = `${process.env.PUBLIC_URL}/data/${fileName}`;
  console.log(`Fetching ${fileName} from`, csvUrl);

  const res = await fetch(csvUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${csvUrl}: ${res.status} ${res.statusText}`);
  }
  const txt  = await res.text();
  const rows = Papa.parse(txt, { header: true, skipEmptyLines: true }).data;

  rows.forEach(row => {
    if (spatial === 'Census Block') {
      const centerKey = row.center;
      censusData[centerKey] = row;

      Object.entries(row).forEach(([col, val]) => {
        if (col === 'center' || val === '') return;
        const num = parseFloat(val);
        if (isNaN(num)) return;
        if (!minMax[col]) {
          minMax[col] = { min: num, max: num };
        } else {
          minMax[col].min = Math.min(minMax[col].min, num);
          minMax[col].max = Math.max(minMax[col].max, num);
        }
      });

    } else {
      const [, dist, mode] = row.isochrone.split('-');
      const key            = `${row.center}|${dist}-${mode}`;
      isoData[key]         = row;
      const rangeKeyBase   = `${dist}-${mode}`;

      Object.entries(row).forEach(([col, val]) => {
        if (col === 'isochrone' || col === 'center' || val === '') return;
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
    }
  });

  console.log('minMax:', minMax);
}

function ratioToColor(ratio) {
  ratio = Math.max(0, Math.min(1, ratio));
  const r  = Math.round(255 * (1 - ratio));
  const g  = Math.round(255 * ratio);
  const h2 = n => n.toString(16).padStart(2, '0');
  return `#${h2(r)}${h2(g)}00`;
}

export function getColor(feat, feature, dist, mode, selectedCenter, spatial) {
  if (feature.properties.first_iso_center === "no_isochrone")
    return '#a1a6ab';
  if (feature.id === selectedCenter)
    return '#33425c';
  if (feat === "none")
    return '#97b8d1';

  let row, mmKey;

  if (spatial === 'Census Block') {
    const centerKey = feature.id;
    row   = censusData[centerKey];
    mmKey = feat;
  } else {
    const isoKey = `${feature.id}|${dist}-${mode}`;
    row   = isoData[isoKey];
    mmKey = `${feat}|${dist}-${mode}`;
  }

  if (!row) return '#a1a6ab';

  if (row[feat] === "True")  return "#58bf5f";
  if (row[feat] === "False") return "#912013";

  const val = parseFloat(row[feat]);
  if (isNaN(val)) return '#a1a6ab';

  const mm = minMax[mmKey];
  if (!mm || mm.max === mm.min) return '#a1a6ab';

  let ratio;
  if (feat === "avg_housing_price") {
    const v    = Math.log(val);
    const vMin = Math.log(mm.min);
    const vMax = Math.log(mm.max);
    ratio      = (v - vMin) / (vMax - vMin);
  } else {
    ratio = (val - mm.min) / (mm.max - mm.min);
  }

  return ratioToColor(ratio);
}

export function getFeatureValue(feat, centerId, dist, mode, spatial) {
  if (feat === 'none') return "None";

  let row;
  if (spatial === 'Census Block') {
    row = censusData[centerId]; 
  } else {
    const key = `${centerId}|${dist}-${mode}`;
    row = isoData[key];
  }

  if (!row) return "None";
  if (row[feat] === "True" || row[feat] === "False")
    return row[feat];

  const num = parseFloat(row[feat]);
  if (Number.isNaN(num)) return "None";

  return feat === "foreclosure_over_area"
    ? num.toFixed(8).toString()
    : num.toFixed(4).toString();
}
