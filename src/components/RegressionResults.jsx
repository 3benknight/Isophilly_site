import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const data = [
    {
        name: 'Census Block Group',
        r2: 0.064,
        coefficients: {
            area_m2: 3.236e-07,
            avg_stars: 3859.8458,
            choice: -4968.5486,
            no_truck_length: 0.0062,
            distance_pool: 6.115e+05,
            foreclosure_count: -4.7441,
            foreclosure_over_area: -1.103e+09,
        },
    },
    {
        name: '600-foot',
        r2: 0.036,
        coefficients: {
            area_m2: -0.0170,
            avg_stars: 1333.4382,
            choice: -4009.2743,
            no_truck_length: -0.4328,
            distance_pool: -2.229e+05,
            foreclosure_count: 1894.9943,
            foreclosure_over_area: -5.626e+09,
        },
    },
    {
        name: '1200-foot',
        r2: 0.517,
        coefficients: {
            area_m2: -0.0004,
            avg_stars: 6335.1452,
            choice: -6330.4535,
            no_truck_length: -0.0173,
            distance_pool: 3.662e+05,
            foreclosure_count: 43.0981,
            foreclosure_over_area: -1.393e+09,
        },
    },
    {
        name: '1800-foot',
        r2: 0.643,
        coefficients: {
            area_m2: -0.0001,
            avg_stars: 4642.0345,
            choice: -4910.0332,
            no_truck_length: -0.0063,
            distance_pool: 3.345e+05,
            foreclosure_count: 25.9021,
            foreclosure_over_area: -1.758e+09,
        },
    },
    {
        name: '600-car',
        r2: 0.791,
        coefficients: {
            area_m2: -1.024e-05,
            avg_stars: -602.5676,
            choice: -2342.9964,
            no_truck_length: 0.0116,
            distance_pool: 5.989e-05,
            foreclosure_count: -2.0338,
            foreclosure_over_area: -1.76e+09,
        },
    },
    {
        name: '1200-car',
        r2: 0.938,
        coefficients: {
            area_m2: -1.492e-06,
            avg_stars: -7904.5838,
            choice: -139.9527,
            no_truck_length: 0.0180,
            distance_pool: -9.592e-11,
            foreclosure_count: -4.0560,
            foreclosure_over_area: 0.0457,
        },
    },
    {
        name: '1800-car',
        r2: 0.876,
        coefficients: {
            area_m2: -9.44e-09,
            avg_stars: -7997.0129,
            choice: 41330.0,
            no_truck_length: 0.0091,
            distance_pool: 0.0,
            foreclosure_count: -3.0475,
            foreclosure_over_area: -0.0841,
        },
    },
    {
        name: '600-pt',
        r2: 0.119,
        coefficients: {
            area_m2: -0.0130,
            avg_stars: 4608.0542,
            choice: -2206.5181,
            no_truck_length: -0.1185,
            distance_pool: 2.641e+05,
            foreclosure_count: 890.4958,
            foreclosure_over_area: -2.606e+09,
        },
    },
    {
        name: '1200-pt',
        r2: 0.524,
        coefficients: {
            area_m2: -0.0003,
            avg_stars: 2090.1222,
            choice: -4451.4022,
            no_truck_length: 0.0028,
            distance_pool: 4.314e+05,
            foreclosure_count: 30.7188,
            foreclosure_over_area: -1.508e+09,
        },
    },
    {
        name: '1800-pt',
        r2: 0.806,
        coefficients: {
            area_m2: -0.0001,
            avg_stars: 4021.1463,
            choice: -5051.7615,
            no_truck_length: 0.0085,
            distance_pool: 2.117e+05,
            foreclosure_count: 12.1320,
            foreclosure_over_area: -1.607e+09,
        },
    },
];

export default function RegressionResults() {
    const baseline = data[0];
    const predictors = Object.keys(baseline.coefficients);
    const numericCols = ['r2', ...predictors];

    const maxAbs = numericCols.reduce((acc, col) => {
        const vals = data.map(row =>
            col === 'r2' ? row.r2 : row.coefficients[col]
        );
        return { ...acc, [col]: Math.max(...vals.map(Math.abs)) };
    }, {});

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `200px repeat(${numericCols.length}, 1fr)`,
        gridAutoRows: '60px',
    };

    const cellBase = {
        position: 'relative',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8px',
        boxSizing: 'border-box',
    };

    const highlight = (value, col) => {
        if (Math.abs(value) === maxAbs[col]) {
            return {
                backgroundColor:
                    value >= 0 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'
            };
        }
        return {};
    };

    const renderChange = (val, base) => {
        if (base === 0) {
            return (
                <span>
                    {val.toLocaleString(undefined, { maximumFractionDigits: 2 })} (N/A)
                </span>
            );
        }
        const pct = ((val - base) / Math.abs(base)) * 100;
        const Arrow = pct >= 0 ? FaArrowUp : FaArrowDown;
        const color = pct >= 0 ? 'green' : 'red';
        const arrowStyle = {
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            color,
        };
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Arrow style={arrowStyle} />
                <span style={{ paddingLeft: '24px' }}> 
                    {val.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                    ({pct >= 0 ? '+' : ''}
                    {pct.toFixed(1)}%)
                </span>
            </div>
        );
    };

    return (
        <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <div style={gridStyle}>
                <div style={{ ...cellBase, fontWeight: 'bold' }}>Regression</div>
                {numericCols.map(col => (
                    <div
                        key={col}
                        style={{ ...cellBase, fontWeight: 'bold' }}
                    >
                        {col === 'r2' ? 'R²' : col}
                    </div>
                ))}

                {data.map(row => (
                    <React.Fragment key={row.name}>
                        <div style={cellBase}>{row.name}</div>
                        <div
                            style={{
                                ...cellBase,
                                ...highlight(row.r2, 'r2')
                            }}
                        >
                            {row.r2.toFixed(3)}
                        </div>
                        {predictors.map(pred => {
                            const val = row.coefficients[pred];
                            const base = baseline.coefficients[pred];
                            const content =
                                row === baseline
                                    ? val.toLocaleString(undefined, { maximumFractionDigits: 2 })
                                    : renderChange(val, base);
                            return (
                                <div
                                    key={pred}
                                    style={{
                                        ...cellBase,
                                        ...highlight(
                                            row === baseline ? val : val,
                                            pred
                                        )
                                    }}
                                >
                                    {content}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
