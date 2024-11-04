import React from 'react';
import { LayersControl, GeoJSON} from 'react-leaflet';

const SampleChibaComponents = ({chiba,averageArea}) => {
  return(
    <>
        <LayersControl.Overlay id="chiba" name="Chiba" >
          {chiba && 
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
          }
        </LayersControl.Overlay>

        <LayersControl.Overlay id="chibaaa" name="Chiba - Average Area">
        {chiba && 
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
        }
        </LayersControl.Overlay>

        <LayersControl.Overlay id="chibaapr" name="Chiba - Area to Population Ratio">
        {chiba && 
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
          }
        </LayersControl.Overlay>
    </>
  );
};

export default SampleChibaComponents;
