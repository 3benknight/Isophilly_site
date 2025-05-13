
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { setCensusRegion, setIsochrone, setDist, setMode, setFeature, setSpatial } from "./Store";
import { Container, Row, Col } from "react-bootstrap";
import './css/Dashboard.css';
import LeafletDashboard from './mapping/Leaflet';
import "leaflet/dist/leaflet.css";
import IsochroneDropdown from "./mapping/IsochroneDropdown";
import FeatureDropdown from './mapping/FeatureDropdown';
import { loadIsochroneStats } from './Colors';
import RegressionResults from './RegressionResults';

function Dashboard({selectedRegion, setCensusRegion, setIsochroneOverlay, distance, setDistance, tranMode, setTranMode, feat, setFeat, spatial, setSpatialType}) {
  const [showIso, setShowIso] = useState(false);
  const [selectedValue, setSelectedValue] = useState("None");
  const [dataLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    loadIsochroneStats(spatial).then(() => setLoaded(true)).catch(console.error);
  }, [spatial]);

  let isochroneDropdown = (selectedRegion !== "none") ? <Col className="left-col d-flex justify-content-center"><IsochroneDropdown setIso={setIsochroneOverlay} selected={selectedRegion} showIsochrone={showIso} time={distance} getTime={setDistance} mode={tranMode} getMode={setTranMode} setShowIsochrone={setShowIso}className="isochrone_dropdown"/></Col> : <Col className="d-flex justify-content-center"><span>Select a region to display options</span></Col>
  let featureDropdown = <Col className="left-col d-flex justify-content-center"><FeatureDropdown feat={feat} setFeat={setFeat} spatial={spatial} setSpatial={setSpatialType} className="isochrone_dropdown"/></Col>
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
            dataLoaded={dataLoaded}
            spatial={spatial}
          />
        </Row>
        <Row title="Change isochrone parameters" className="dashboard-selection-reg">
        <div className="dashboard-header">Regressions</div>
          <div className="d-flex justify-content-center w-100 h-20">
            This table includes the baseline Census Block regression and the regressions of each isochrone. The largest absolute value in each column is highlighted. The best fit was with an 20min car isochrone.
          </div>
          <RegressionResults/>
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
    spatial: state.selectedSpatial,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCensusRegion: (region) => dispatch(setCensusRegion(region)),
    setIsochroneOverlay: (iso) => dispatch(setIsochrone(iso)),
    setDistance: (dist) => dispatch(setDist(dist)),
    setTranMode: (mode) => dispatch(setMode(mode)),
    setFeat: (feat) => dispatch(setFeature(feat)),
    setSpatialType: (type) => dispatch(setSpatial(type)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
