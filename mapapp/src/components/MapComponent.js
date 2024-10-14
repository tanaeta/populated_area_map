import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON, useMap, Marker, Popup,Polygon, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Slider from 'rc-slider';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import DateSlider from './DateSlider.js';
import 'leaflet.heat';
import MunicipalityPolygon from './MunicipalityPolygon.js';

// 2020年から2025年までの月の配列を作成
const createMonthsArray = (startYear, endYear) => {
  const months = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push(parseInt(moment([year, month - 1]).format('YYYYMM')));
    }
  }
  return months;
};
const validMonths = createMonthsArray(2020, 2025);

const MapComponent = ({selectedPrefectures}) => {
  const position = [35.6895, 139.6917]; 
  const [geojsonData, setGeojsonData] = useState(null);
  const [minPopulation, setMinPopulation] = useState(0);
  const [dateRange, setDateRange] = useState([new Date(2025, 12, 31), new Date(2025, 12, 31)]);
  const [chiba, setChiba] = useState(null);
  const [averageArea, setAverageArea] = useState(0);
  const [municipalityPolygons, setMunicipalityPolygons] = useState([]);

  // スライダーの値が変更されたときのハンドラー
  const handlePopulationSliderChange = (value) => {
    setMinPopulation(value);
  };

  const handleDateSliderChange = (value) => {
    setDateRange(dateRange.map((date, index) => {
      return index === 1 ? date : value;
    }));
  };

  // 日付のフォーマット
  const formatMonth = (value) => {
    return moment(value, 'YYYYMM').format('YYYY-MM');
  };
  const formatDate = (value) => {
    return moment(value, 'YYYYMMDD').format('YYYY-MM-DD');
  };

  useEffect(() => {
    const jsonload = () =>{
      fetch('/geojson/sample.json')
        .then(response => response.json())
        .then(data => setGeojsonData(data));
    }
    jsonload();
  }, []);

  useEffect(() => {
    const jsonload = async () => {
      const response = await fetch('/geojson/chiba.geojson');
      const data = await response.json();
      setChiba(data);

      // Calculate average area
      const areas = data.features.map(feature => feature.properties.JINKO || 0);
      const totalArea = areas.reduce((sum, area) => sum + area, 0);
      const avgArea = totalArea / areas.length;
      setAverageArea(avgArea);
    };

    jsonload();
  }, []);

  return (
    <>
      <MapContainer 
        center={position} 
        zoom={13} 
        className="h-[60vh] w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">
          <LayersControl.Overlay name="Chiba">
            {chiba && (
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
                )}
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Chiba - Average Area">
          {chiba && (
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
          )}
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Chiba - Area to Population Ratio">
            {chiba && (
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
            )}
          </LayersControl.Overlay>

          {/** 市区町村ポリゴン */}
          <LayersControl.Overlay checked name="市区町村ポリゴン">
            <FeatureGroup>
              <MunicipalityPolygon
                selectedPrefectures={selectedPrefectures}
               />
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>

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

      <div className='h-[20vh]'>
        {/** 人口スライダー */}
        <div style={{ margin: '20px' }}>
          <h3>Population Filter</h3>
          <Slider
            min={0}
            max={20000000}
            defaultValue={0}
            onChange={handlePopulationSliderChange}
            railStyle={{ backgroundColor: 'gray' }}
            trackStyle={{ backgroundColor: 'blue' }}
            handleStyle={{ borderColor: 'blue' }}
          />
          <div>Minimum Population: {minPopulation}</div>
        </div>

        {/** 日付スライダー */}
        <div style={{ margin: '20px' }}>
          <DateSlider range
            onChange={handleDateSliderChange}
            min={new Date(2022, 1, 1)}
            max={new Date(2025, 12, 31)}
            defaultValue={new Date(2025, 12, 31)}
            />
          <div>
            Selected Range: {formatDate(dateRange[0])} - {formatDate(dateRange[1])}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapComponent;