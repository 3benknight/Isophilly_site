import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { filterIsochrones, hasIsochrone } from '../Math';

const IsochroneDropdown = ({setIso, selected, showIsochrone, setShowIsochrone, time, getTime, mode, getMode}) => {
    const handleCheckbox = e => setShowIsochrone(e.target.checked);

    const selectDistance = <DropdownButton variant="outline-warning" id="dropdown-basic-button" title={"Time: " + (time/60) + " minutes"}>
            <Dropdown.Item as="button" key = {"dist_1"} active={600 === time} onClick={() => getTime(600)}>10 Minutes</Dropdown.Item>
            <Dropdown.Item as="button" key = {"dist_2"} active={1200 === time} onClick={() => getTime(1200)}>20 Minutes</Dropdown.Item>
            <Dropdown.Item as="button" key = {"dist_3"} active={1800 === time} onClick={() => getTime(1800)}>30 Minutes</Dropdown.Item>
        </DropdownButton>

    const selectMode = <DropdownButton variant="outline-warning" id="dropdown-basic-button" title={"Mode: " + mode}>
            <Dropdown.Item as="button" key = {"mode_1"} active={"foot" === mode} onClick={() => getMode("foot")}>Walking</Dropdown.Item>
            <Dropdown.Item as="button" key = {"mode_2"} active={"pt" === mode} onClick={() => getMode("pt")}>Public Transit</Dropdown.Item>
            <Dropdown.Item as="button" key = {"mode_3"} active={"car" === mode} onClick={() => getMode("car")}>Car</Dropdown.Item>
        </DropdownButton>

    return ( 
        <div className="iso-dropdown-container">
            {selectDistance}
            {selectMode}
            <label style={{ marginLeft: '0.5rem', color: '#fff' }}>
            <input
                type="checkbox"
                checked={showIsochrone}
                disabled={!hasIsochrone(selected)}
                onChange={handleCheckbox}
                /> Show Isochrone
            </label>
        </div>
    );
}

export default IsochroneDropdown;