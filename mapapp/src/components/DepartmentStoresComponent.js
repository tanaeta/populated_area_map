import React, { useState } from "react";
import { Marker, Popup, FeatureGroup } from "react-leaflet";

const clickHandler = (departmentStore, setSelectedDepartmentStores) => {
  setSelectedDepartmentStores([departmentStore]);
}

const DepartmentStoresComponent = ({ departmentStores, setSelectedDepartmentStores }) => {
  const [popupOpen, setPopupOpen] = useState(null);

  return (
    <>
      <FeatureGroup>
        {departmentStores && departmentStores.map((departmentStore, index) => {
          return (
            <Marker
              key={index}
              position={[departmentStore.lat, departmentStore.lng]}
              eventHandlers={{
                click: () => {
                  clickHandler(departmentStore, setSelectedDepartmentStores);
                },
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
                  <h3>{departmentStore.code}</h3>
                  {departmentStore.lat},{departmentStore.lng}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </FeatureGroup>
    </>
  );
}

export default DepartmentStoresComponent;