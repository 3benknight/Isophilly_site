import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const FeatureDropdown = ({feat, setFeat}) => {

    //area_m2,avg_stars,choice,no_truck_length,distance_pool,avg_housing_price,foreclosure_count,foreclosure_over_area
    const selectDistance = <DropdownButton variant="outline-warning" id="dropdown-basic-button" title={"Current Feature: " + feat}>
        <Dropdown.Item as="button" key = {"feat_1"} active={"none" === feat} onClick={() => setFeat("none")}>None</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_2"} active={"area_m2" === feat} onClick={() => setFeat("area_m2")}>Isochrone Area</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_3"} active={"avg_stars" === feat} onClick={() => setFeat("avg_stars")}>Average Yelp Review Score</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_4"} active={"choice" === feat} onClick={() => setFeat("choice")}>Includes Neglected Neighborhood</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_5"} active={"no_truck_length" === feat} onClick={() => setFeat("no_truck_length")}>Total No-Truck Street Length</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_6"} active={"distance_pool" === feat} onClick={() => setFeat("distance_pool")}>Distance From Public Pool</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_7"} active={"avg_housing_price" === feat} onClick={() => setFeat("avg_housing_price")}>Average Housing Price</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_8"} active={"foreclosure_count" === feat} onClick={() => setFeat("foreclosure_count")}>Number of Foreclosures</Dropdown.Item>
        <Dropdown.Item as="button" key = {"feat_9"} active={"foreclosure_over_area" === feat} onClick={() => setFeat("foreclosure_over_area")}>Foreclosures a Percentage of Area</Dropdown.Item>
    </DropdownButton>

    return ( 
        <div className="iso-dropdown-container">
            {selectDistance}
        </div>
    );
}

export default FeatureDropdown;