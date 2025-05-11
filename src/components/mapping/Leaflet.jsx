import censusBlocks from "../../assets/data/census_blocks.json";
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { findIsochrone } from "../Math";
import { getColor } from "../Colors";

const LeafletDashboard = ({ mapId, selectedCensusBlock, setCensusBlock, setIso, show, time, mode, feat }) => {
  const [map, setMap] = useState(null);
  const geoJsonLayer = useRef(null);
  const isoLayer    = useRef(null);
  const tileLayer   = useRef(
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    })
  );

  function style(feature) {
    return {
      fillColor: getColor(feat, feature, time, mode, selectedCensusBlock),
      weight: 2,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  function highlightFeature(e) {
    e.target.setStyle({ weight: 5, color: '#666', dashArray: '', fillOpacity: 0.7 });
    e.target.bringToFront();
  }

  function resetHighlight(e) {
    geoJsonLayer.current.resetStyle(e.target);
  }

  function onFeatureClick(e) {
    setIso("none");
    setCensusBlock(e.target.feature.id);
  }

  // 1) Initialize map once
  useEffect(() => {
    if (map) return;
    const m = L.map(mapId, {
      center: [39.98, -75.125],
      zoom: 11.5,
      zoomControl: false,
      minZoom: 11
    });
    tileLayer.current.addTo(m);
    setMap(m);
  }, [map, mapId]);

  // 2) (Re-)build the censusBlocks layer whenever map or selectedCensusBlock changes
  useEffect(() => {
    if (!map) return;

    if (geoJsonLayer.current) {
      geoJsonLayer.current.remove();
    }

    geoJsonLayer.current = L.geoJSON(censusBlocks, {
      style,
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: highlightFeature,
          mouseout:  resetHighlight,
          click:     onFeatureClick
        });
      }
    }).addTo(map);
  }, [map, selectedCensusBlock, feat, time, mode]);

  // 3) (Re-)draw the selected isochrone (on top) whenever map or isoSel changes
  useEffect(() => {
    if (!map) return;
  
    // tear down any existing layer
    if (isoLayer.current) {
      isoLayer.current.remove();
      isoLayer.current = null;
    }
  
    // if we’re not supposed to show, bail early
    if (!show) return;
  
    // async loader
    const loadIso = async () => {
      try {
        const iso = await findIsochrone(selectedCensusBlock, time, mode);
        if (iso) {
          isoLayer.current = L.geoJSON(iso, {
            style: {
              color: '#ff7800',
              weight: 4,
              opacity: 0.9,
              fillOpacity: 0.2
            }
          })
          .addTo(map)
          .bringToFront();
        } else {
          console.warn("Isochrone not found for", selectedCensusBlock, time);
        }
      } catch (err) {
        console.error("Error loading isochrone:", err);
      }
    };
  
    loadIso();
    
    // optional cleanup if findIsochrone can outlive the component:
    return () => {
      if (isoLayer.current) {
        isoLayer.current.remove();
        isoLayer.current = null;
      }
    };
  }, [map, selectedCensusBlock, show, time, mode]);  

  return (
    <div id={mapId} style={{ width: '100%', height: '100%', zIndex: 0 }} />
  );
};

export default LeafletDashboard;
