import React, { useEffect, useState} from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON, useMap, Marker, Popup,Polygon, FeatureGroup,Pane,Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import 'leaflet.heat';
import MunicipalityPolygon from './MunicipalityPolygon.js';

const MapComponent = ({selectedPrefectures,minPopulation,setMinPopulation,dateRange,setDateRange,customDate,setCustomDate,customDateRange,setCustomDateRange}) => {
  const position = [35.6895, 139.6917]; 
  const [geojsonData, setGeojsonData] = useState(null);
  const [chiba, setChiba] = useState(null);
  const [averageArea, setAverageArea] = useState(0);
  const [municipalityPolygons, setMunicipalityPolygons] = useState([]);
  const [roads, setRoads] = useState([]);

  useEffect(() => {
    const jsonload = () =>{
      fetch('/geojson/sample.json')
        .then(response => response.json())
        .then(data => setGeojsonData(data));
    }

    const chibaJsonload = () => {
      // chibaにすでにデータがあれば何もしない
      if (chiba) return;
      // 千葉県のジオJSONデータを取得
      fetch('/geojson/chiba.geojson')
      .then(response => response.json())
      .then(data => {
        setChiba(data)
        // Calculate average area
        const areas = data.features.map(feature => feature.properties.JINKO || 0);
        const totalArea = areas.reduce((sum, area) => sum + area, 0);
        const avgArea = totalArea / areas.length;
        setAverageArea(avgArea); 
      });
    }

    jsonload();
    chibaJsonload();
  }, []);

  useEffect(() => {
    // Overpass APIを使ってOpenStreetMapの道路データを取得する
    const getRoadsData = async () => {
      try {
        const boundingBoxSize = 0.05;
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            data: `[out:json];way["highway"~"^(primary|trunk)$"](${position[0] - boundingBoxSize},${position[1] - boundingBoxSize},${position[0] + boundingBoxSize},${position[1] + boundingBoxSize});out geom;`
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const roadsData = data.elements.map(way => way.geometry.map(point => [point.lat, point.lon]));
        setRoads(roadsData);
      } catch (error) {
        console.error("Error fetching roads data:", error);
      }
    };
    getRoadsData();
  }, []);

  return (
    <>
      <MapContainer 
        center={position} 
        zoom={13} 
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {chiba && 
          <LayersControl position="topright">
            <LayersControl.Overlay id="chiba" name="Chiba" >
                <GeoJSON
                  data={chiba}
                  style={(feature) => {
                    const area = feature.properties.JINKO || 0;
                    let fillColor = 'green';
                    if (area > 1000000) fillColor = 'red';
                    else if (area > 500000) fillColor = 'orange';
                    else if (area > 100000) fillColor = 'yellow';
                      return {
                        fillColor,
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                      };
                    }}
                    onEachFeature={(feature, layer) => {
                      layer.on({
                      click: () => {
                        layer.bindPopup(`人口: ${feature.properties.JINKO || 'No data'}<br>${feature.properties.PREF_NAME + feature.properties.CITY_NAME + feature.properties.S_NAME || 'No data'}`).openPopup();
                      }
                      });
                    }}
                    />
            </LayersControl.Overlay>

            <LayersControl.Overlay id="chibaaa" name="Chiba - Average Area">
              <GeoJSON
                data={chiba}
                style={(feature) => {
                  const area = feature.properties.JINKO || 0;
                  let fillColor = 'green';
                  if (area > averageArea * 2) fillColor = 'red';
                  else if (area > averageArea) fillColor = 'orange';
                  else if (area > averageArea / 2) fillColor = 'yellow';
                  return {
                    fillColor,
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                  };
                }}
                onEachFeature={(feature, layer) => {
                  layer.on({
                  click: () => {
                    layer.bindPopup(`人口: ${feature.properties.JINKO || 'No data'}<br>${feature.properties.PREF_NAME + feature.properties.CITY_NAME + feature.properties.S_NAME || 'No data'}`).openPopup();
                  }
                  });
                }}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay id="chibaapr" name="Chiba - Area to Population Ratio">
                <GeoJSON
                  data={chiba}
                  style={(feature) => {
                    const area = feature.properties.AREA || 1; // AREAが0の場合を避けるために1をデフォルト値とする
                    const population = feature.properties.JINKO || 0;
                    const ratio = population / area;
                    let fillColor = 'green';
                    if (ratio > 0.1) fillColor = 'red';
                    else if (ratio > 0.01) fillColor = 'orange';
                    else if (ratio > 0.001) fillColor = 'yellow';
                    return {
                      fillColor,
                      weight: 2,
                      opacity: 1,
                      color: 'white',
                      dashArray: '3',
                      fillOpacity: 0.7
                    };
                  }}
                  onEachFeature={(feature, layer) => {
                    layer.on({
                      click: () => {
                        layer.bindPopup(`人口: ${feature.properties.JINKO || 'No data'}<br>面積: ${feature.properties.AREA || 'No data'}<br>割合: ${(feature.properties.JINKO / feature.properties.AREA).toFixed(2) || 'No data'}<br>${feature.properties.PREF_NAME + feature.properties.CITY_NAME + feature.properties.S_NAME || 'No data'}`).openPopup();
                      }
                    });
                  }}
                />
            </LayersControl.Overlay>

            {/** 線路情報表示 */}
            <LayersControl.Overlay id="ORM" name="OpenRailMap">
              <TileLayer
                //OpenRailMapの地図タイルをオーバーレイとして使用
                url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a> contributors'
              />
            </LayersControl.Overlay>

            {/** 道路情報表示 */}
            <LayersControl.Overlay id="Road" name="Road">
              <FeatureGroup>
                {roads && roads.map((road, index) => {
                  if (road.length > 1) { // ポイント数がある程度のポリラインのみ表示
                    return(<Polyline positions={road} pathOptions={{ color: 'purple'}} />);
                  }
                })}
              </FeatureGroup>
            </LayersControl.Overlay>

            {/** 市区町村ポリゴン */}
            <LayersControl.Overlay checked name="市区町村ポリゴン">
              <Pane 
                name="municipality-polygon" 
                style={{zIndex: 400}}
              >
                <FeatureGroup>
                  <MunicipalityPolygon
                    selectedPrefectures={selectedPrefectures}
                  />
                </FeatureGroup>
              </Pane>
            </LayersControl.Overlay>
          </LayersControl>
        }

        {/** geojsonをロードしてMarkerとして表示 */}
        {geojsonData && geojsonData.features.map((feature, index) => {
          const featureMonth = parseInt(moment(feature.properties.registrationDate).format('YYYYMM'));
          return feature.properties.population >= minPopulation &&
          featureMonth >= moment(dateRange[0]).format('YYYYMM') &&
          featureMonth <= moment(dateRange[1]).format('YYYYMM') ? (
            <Marker 
              key={index} 
              position={[
                feature.geometry.coordinates[1], 
                feature.geometry.coordinates[0]
              ]}
            >
              <Popup>
                {feature.properties.name || 'No name'}<br />
                Population:{feature.properties.population || 'No population'}
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </>
  );
};

export default MapComponent;