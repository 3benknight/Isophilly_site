import { createStore } from 'redux';
// Define the initial state
const initialState = {
  censusRegion: "none",
  censusData: [],
  selectedIsochrone: "none",
  selectedMode: "pt",
  selectedDist: 600,
  selectedFeature: "none",
};

/**
 * Reducer function to manage the state updates.
 * 
 * @param {object} state - The current state.
 * @param {object} action - The action dispatched.
 * @returns {object} The updated state.
 */
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'censusRegion':
      return { ...state, censusRegion: action.payload };
    case 'censusBlockData':
      return { ...state, censusData: action.payload};
    case 'selectedIsochrone':
      return { ...state, selectedIsochrone: action.payload};
    case 'selectedMode':
      return { ...state, selectedMode: action.payload};
    case 'selectedDist':
      return { ...state, selectedDist: action.payload};
    case 'selectedFeature':
      return { ...state, selectedFeature: action.payload};
    default:
      return state;
  }
}

/**
 * Updates the dashboard date.
 * 
 * @param {string} date - The chosen census block data.
 * @returns {object} The action.
 */
export function setCensusRegion(date) {
    return { type: 'censusRegion', payload: date };
}

/**
 * Updates the censusBlockData.
 * 
 * @param {Array} data - The census data.
 * @returns {object} The action.
 */
export function setCensusBlockData(data) {
  return { type: 'censusBlockData', payload: data };
}

/**
 * Updates the selected Isochrone.
 * 
 * @param {string} iso - The chosen census block data.
 * @returns {object} The action.
 */
export function setIsochrone(iso) {
  return { type: 'selectedIsochrone', payload: iso };
}

/**
 * Updates the selected Mode.
 * 
 * @param {string} mode - The chosen isochrone mode.
 * @returns {object} The action.
 */
export function setMode(mode) {
  return { type: 'selectedMode', payload: mode };
}

/**
 * Updates the selected Dist.
 * 
 * @param {string} dist - The chosen isochrone distance.
 * @returns {object} The action.
 */
export function setDist(dist) {
  return { type: 'selectedDist', payload: dist };
}

/**
 * Updates the selected Dist.
 * 
 * @param {string} feature - The chosen map feature.
 * @returns {object} The action.
 */
export function setFeature(feature) {
  return { type: 'selectedFeature', payload: feature };
}
// Create the Redux store
const store = createStore(reducer);

export default store;