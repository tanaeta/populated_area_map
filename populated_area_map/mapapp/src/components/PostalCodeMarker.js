import { Marker } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

//defaultMarker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const PostalCodeMarker = (props) => {
  const center = [35.3628, 138.7307];
  const point1 = [35.274774075037776, 138.6131286621094];
  const point2 = [35.292710387701696, 138.9097595214844];

  const createCustomCluster = (cluster) => {
    var childCount = cluster.getChildCount();

    var size = "marker-";
    if (childCount < 7) {
      size += "small";
    } else if (childCount < 8) {
      size += "medium";
    } else {
      size += "large";
    }

    return L.divIcon({
      html: `<div class="${size} marker-cluster"><span>${childCount}</span></div>`,
    });
  };

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createCustomCluster}
      spiderfyOnMaxZoom={true}
    >
      <Marker position={point1} />
      <Marker position={point2} />
      <Marker position={center} />
      <Marker position={center} />
      <Marker position={center} />
      <Marker position={center} />
      <Marker position={center} />
      <Marker position={center} />
    </MarkerClusterGroup>
  );
}
export default PostalCodeMarker;