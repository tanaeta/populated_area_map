import React from "react";
import { Marker, Popup ,FeatureGroup } from "react-leaflet";
import L from 'leaflet'

// カスタムアイコンを作成
const redIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:red; width:24px; height:24px; border-radius:50%;'></div>",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -6]
});

const PostOfficesComponent = ({postOffices}) => {
  return (
    <>
      <FeatureGroup>
        {postOffices && postOffices.map((postOffice, index) => {
          return (
              <Marker 
                key={index} 
                position={[postOffice.lat, postOffice.lng]} 
                icon={redIcon}
                eventHandlers={{
                  mouseover: (event) =>{ 
                    event.target.openPopup()
                  },
                  mouseout: (event) =>{ 
                    event.target.closePopup()
                  }
                }}
              >
                <Popup>
                  <div>
                    zip:{postOffice.zipCode}<br />
                    latlng:{postOffice.lat},{postOffice.lng}<br />
                    code:{postOffice.code}<br />
                    distance:{postOffice.distance}<br />
                  </div>
                </Popup>
              </Marker>
          );
        })}
      </FeatureGroup>
    </>
  );
}

export default PostOfficesComponent;