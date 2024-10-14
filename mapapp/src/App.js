import React, { useState } from 'react';
import MapComponent from './components/MapComponent.js';
import PrefectureCheckboxComponent from './components/PrefectureCheckboxComponent.js';

const App = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState([]);

  return (
    <>
      <div className="h-[100vh]">
        <div className="h-[80vh]">
          <MapComponent
            selectedPrefectures={selectedPrefectures}
          />
        </div>
        <div className="h-[20vh]">
          <PrefectureCheckboxComponent
            selectedPrefectures={selectedPrefectures}
            setSelectedPrefectures={setSelectedPrefectures}
          />
          Filters
        </div>
      </div>
    </>
    );
}

export default App;
