import React, { useState, useEffect } from 'react';
import { Polygon, Popup } from 'react-leaflet';
import axios from 'axios';

const transformCoordinates = (coords) => {
  // GeoJSONの[経度, 緯度]を[緯度, 経度]に変換
  return coords.map(list => 
    list.map(polygon => 
    polygon.map(point => [point[1], point[0]])
  ));
};

const MunicipalityPolygon = ({selectedPrefectures}) => {
  const [municipalityPolygons, setMunicipalityPolygons] = useState([]);

  useEffect(() => {
    const fetchShapeMunicipality = async () => {
      // バックエンドAPIからジオメトリデータを取得します
      try {
        const response = await axios.post('http://localhost:3001/api/shape_municipality', {
          selectedPrefectures,
        });
        setMunicipalityPolygons(response.data);  // 取得したデータをステートに格納
      } catch (error) {
        console.error('Error fetching geom data:', error);
      }
    };
    // 選択された都道府県が変更されたときにfetchShapeMunicipalityを呼び出す
    if (selectedPrefectures.length > 0){
      // 都道府県が一つ以上選択されていればfetchShapeMunicipalityを呼び出す
      fetchShapeMunicipality();
    }else{
      // 都道府県が選択されていない場合は空の配列をセット（初期化）
      setMunicipalityPolygons([]);
    }
  },[selectedPrefectures]);

  const getColorByPopulationPercentage = (percentage) => {
    if (percentage > 20) return 'purple'; // 30%以上
    if (percentage > 15) return 'red'; // 20%以上30%未満
    if (percentage > 10) return 'orange'; // 10%以上20%未満
    return null; // 10%未満
  };

  return (
    <>
      {municipalityPolygons.map((municipality, index) => {
        // 総人口と15歳未満の人口の割合から色を決定
        const { totalPopulation, populationUnder15, municipalityName } = municipality;
        if (totalPopulation <= 0) return null; // 有効なデータがない場合は表示しない
        const percentage = (populationUnder15 / totalPopulation) * 100;
        const color = getColorByPopulationPercentage(percentage);
        // 色がnull（割合が閾値以下）なら表示しない
        if (color === null) return null;
        return (
          <Polygon
            key={index} 
            pathOptions={{color}}
            positions={transformCoordinates(municipality.geojson.coordinates)}
          >
            <Popup>
              {municipalityName || 'No name'}<br />
              総人口: {municipality.totalPopulation || 'No population'}<br />
              15歳以下: {municipality.populationUnder15 || 'No population'}<br />
              割合: {percentage.toFixed(2)}%
            </Popup>
          </Polygon>
        )
      })}
    </>
  );
};

export default MunicipalityPolygon;