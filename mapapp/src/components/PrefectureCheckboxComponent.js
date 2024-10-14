import React, { useEffect,useState } from 'react';
import Papa from 'papaparse';

const PrefectureCheckboxComponent = ({ selectedPrefectures, setSelectedPrefectures }) => {
  const [csvData, setCsvData] = useState([]);
  
  useEffect(() => {
    fetch('/prefecture.csv')
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            setCsvData(results.data);
          }
        });
      })
      .catch(error => console.error('Error fetching the CSV file:', error));
  }, []);

  const handleCheckboxChange = (prefectureName) => {
    if (selectedPrefectures.includes(prefectureName)) {
      setSelectedPrefectures(selectedPrefectures.filter(name => name !== prefectureName));
    } else if (selectedPrefectures.length < 3) {
      setSelectedPrefectures([...selectedPrefectures, prefectureName]);
    }
  };

  const handleLabelClick = (prefectureName) => {
    setSelectedPrefectures(selectedPrefectures.filter(name => name !== prefectureName));
  };

  const regions = csvData.reduce((acc, { region_name }) => {
    if (!acc.includes(region_name)) acc.push(region_name);
    return acc;
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-row mb-4">
        <h4 className="text-lg font-semibold pr-2">選択中の都道府県（3県まで選択可）: </h4>
        {selectedPrefectures.map(prefecture => (
          <span
            key={prefecture}
            className="pr-1 pl-1 border-solid border-4 border-sky-500 mr-2 cursor-pointer text-blue-500"
            onClick={() => handleLabelClick(prefecture)}
          >
            {prefecture} ×
          </span>
        ))}
      </div>
      <div className='border-double border-4 border-sky-500 p-1'>
        {regions.map(region => (
          <div key={region}>
            <h3 className="text-lg font-semibold mb-1">{region}</h3>
            <div className="flex flex-row mb-2"> {/* 横並びにするためのスタイル */}
              {csvData
                .filter(data => data.region_name === region)
                .map(({ prefecture_code, prefecture_name }) => (
                  <div key={prefecture_code} className="mr-4"> {/* 項目を横並びにし、適切な間隔を持たせる */}
                    <input
                      type="checkbox"
                      id={`checkbox-${prefecture_code}`}
                      disabled={!selectedPrefectures.includes(prefecture_name) && selectedPrefectures.length >= 3}
                      checked={selectedPrefectures.includes(prefecture_name)}
                      onChange={() => handleCheckboxChange(prefecture_name)}
                    />
                    <label htmlFor={`checkbox-${prefecture_code}`} className="text-gray-800">{prefecture_name}</label>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrefectureCheckboxComponent;