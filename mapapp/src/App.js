import React, { useState } from 'react';
import MapComponent from './components/MapComponent.js';
import SettingsComponent from './components/SettingsComponent.js';

const App = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState([]);
  const [minPopulation, setMinPopulation] = useState(0);
  const [dateRange, setDateRange] = useState([new Date(2025, 12, 31), new Date(2025, 12, 31)]);
  const [customDate, setCustomDate] = useState([]);
  const [customDateRange, setCustomDateRange] = useState([0,0]);

  return (
    <>
      <div className="h-[100vh]">
        <div className="h-[80vh]">
          <MapComponent
            selectedPrefectures={selectedPrefectures}
            minPopulation={minPopulation}
            setMinPopulation={setMinPopulation}
            dateRange={dateRange}
            setDateRange={setDateRange}
            customDate={customDate}
            setCustomDate={setCustomDate}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
          />
        </div>
        <div className="h-[20vh]">
          <SettingsComponent
            selectedPrefectures={selectedPrefectures}
            setSelectedPrefectures={setSelectedPrefectures}
            minPopulation={minPopulation}
            setMinPopulation={setMinPopulation}
            dateRange={dateRange}
            setDateRange={setDateRange}
            customDate={customDate}
            setCustomDate={setCustomDate}
            customDateRange={customDateRange}
            setCustomDateRange={setCustomDateRange}
          />
        </div>
      </div>
    </>
    );
}

export default App;
