import React from 'react';
import 'leaflet.heat';

const HeatmapLayerComponent = ({ chiba }) => {
  // ヒートマップデータの準備
  const heatmapData = chiba ? chiba.features.map(feature => {
    const { AREA, Y_CODE, X_CODE } = feature.properties;
    return [Y_CODE, X_CODE, AREA];
  }) : [];

  // AREAの最大値を取得
  const maxArea = Math.max(...heatmapData.map(point => point[2]));

  // 強度をスケーリング
  const scaledHeatmapData = heatmapData.map(point => [point[0], point[1], point[2] / maxArea]);

  return (
    <HeatmapLayer
      points={scaledHeatmapData}
      longitudeExtractor={m => m[1]}
      latitudeExtractor={m => m[0]}
      intensityExtractor={m => m[2]}
    />
  );
};

export default HeatmapLayerComponent;