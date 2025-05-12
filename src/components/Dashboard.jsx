
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { setCensusRegion, setIsochrone, setDist, setMode, setFeature } from "./Store";
import { Container, Row, Col } from "react-bootstrap";
import './css/Dashboard.css';
import LeafletDashboard from './mapping/Leaflet';
import "leaflet/dist/leaflet.css";
import IsochroneDropdown from "./mapping/IsochroneDropdown";
import FeatureDropdown from './mapping/FeatureDropdown';
import { loadIsochroneStats } from './Colors';

function Dashboard({selectedRegion, setCensusRegion, isochrone, setIsochroneOverlay, distance, setDistance, tranMode, setTranMode, feat, setFeat}) {
  const [showIso, setShowIso] = useState(false);
  const [selectedValue, setSelectedValue] = useState("None");
  useEffect(() => {
    loadIsochroneStats().catch(console.error);
  }, []);

  let isochroneDropdown = (selectedRegion !== "none") ? <Col className="left-col d-flex justify-content-center"><IsochroneDropdown setIso={setIsochroneOverlay} selected={selectedRegion} showIsochrone={showIso} time={distance} getTime={setDistance} mode={tranMode} getMode={setTranMode} setShowIsochrone={setShowIso}className="isochrone_dropdown"/></Col> : <Col className="d-flex justify-content-center"><span>Select a region to display options</span></Col>
  let featureDropdown = <Col className="left-col d-flex justify-content-center"><FeatureDropdown feat={feat} setFeat={setFeat} className="isochrone_dropdown"/></Col>
  return (
    <div className="dashboard-background">
      <Container fluid>
        <Row title="Currently selected region" className="dashboard-selection">
          <div className="dashboard-selection-text">
            CURRENTLY SELECTED REGION: {selectedRegion === "none" ? 
            "No Census Block Selected. Click a region on the map to select one." : selectedRegion}
          </div>
        </Row>
        <Row title="Change isochrone parameters" className="dashboard-selection">
          {isochroneDropdown}
        </Row>
        <Row title="Change isochrone parameters" className="dashboard-selection-big d-flex flex-column justify-content-center align-items-center">
          <div className="dashboard-header">Features Menu</div>
          <div>
            Note: While the map is covered by census blocks, the color represents the value of the selected isochrone for each census group.
          </div>
          <div className="d-flex justify-content-center w-100">
            {featureDropdown}
          </div>
          <div className="d-flex justify-content-center w-100">
            Selected Value: {selectedValue}
          </div>
        </Row>
        <Row className="dashboard-map-wrapper">
          <LeafletDashboard
            mapId={"map"}
            selectedCensusBlock={selectedRegion}
            setCensusBlock={setCensusRegion}
            setIso={setIsochroneOverlay}
            show={showIso}
            time={distance}
            mode={tranMode}
            feat={feat}
            setSel={setSelectedValue}
          />
        </Row>
      </Container>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    selectedRegion: state.censusRegion,
    isochrone: state.selectedIsochrone,
    distance: state.selectedDist,
    tranMode: state.selectedMode,
    feat: state.selectedFeature,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCensusRegion: (region) => dispatch(setCensusRegion(region)),
    setIsochroneOverlay: (iso) => dispatch(setIsochrone(iso)),
    setDistance: (dist) => dispatch(setDist(dist)),
    setTranMode: (mode) => dispatch(setMode(mode)),
    setFeat: (feat) => dispatch(setFeature(feat)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
