import React, { useEffect, useState} from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON, useMap, Marker, Popup,Polygon, FeatureGroup,Pane,Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import moment from 'moment';
import 'rc-slider/assets/index.css';
import 'leaflet.heat';
import MunicipalityPolygon from './MunicipalityPolygon.js';
import SampleChibaComponents from './SampleChibaComponents.js';
import DepartmentStoresComponent from './DepartmentStoresComponent.js';
import PostOfficesComponent from './PostOfficesComponent.js';
import L from 'leaflet'
import icon from "../assets/icon/marker-icon.png";
import iconShadow from "../assets/icon/marker-shadow.png";

// marker setting
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12.5, 20.5],
  popupAnchor: [0, -20.5],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({selectedPrefectures,minPopulation,setMinPopulation,dateRange,setDateRange,customDate,setCustomDate,customDateRange,setCustomDateRange}) => {
  const position = [35.6895, 139.6917]; 
  const [geojsonData, setGeojsonData] = useState(null);
  const [chiba, setChiba] = useState(null);
  const [averageArea, setAverageArea] = useState(0);
  const [municipalityPolygons, setMunicipalityPolygons] = useState([]);
  const [roads, setRoads] = useState([]);
  const [departmentStores, setDepartmentStores] = useState([]);
  const [selectedDepartmentStores, setSelectedDepartmentStores] = useState([]);
  const [postOffices, setPostOffices] = useState([]);

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

    const getDepartmentStoresData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/department_stores');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDepartmentStores(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching DepartmentStores data:", error);
      }
    };

    const getPostOfficesData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/post_offices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPostOffices(data);
        console.log("post_offices",data);
      } catch (error) {
        console.error("Error fetching PostOffices data:", error);
      }
    };
    getPostOfficesData();
    getDepartmentStoresData();
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

      <LayersControl position="topright">

            {/** 商業施設 */}
            {departmentStores &&
              <LayersControl.Overlay  name="商業施設">
                <DepartmentStoresComponent departmentStores={departmentStores} setSelectedDepartmentStores={setSelectedDepartmentStores} />
              </LayersControl.Overlay>
            }

            {/** 郵便局 */}
            {postOffices &&
              <LayersControl.Overlay  name="郵便局">
                {selectedDepartmentStores.length > 0?
                  // 選択された商業施設と同じcodeを持つ郵便局のみ表示
                  <PostOfficesComponent postOffices={
                    postOffices.filter(
                      postOffice => postOffice.code === selectedDepartmentStores[0].code
                    )
                  } />
                  :
                  <PostOfficesComponent postOffices={postOffices} />
                }
              </LayersControl.Overlay>
            }

            {/** サンプルコンポーネント表示 */}
            <SampleChibaComponents chiba={chiba} averageArea={averageArea} />

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