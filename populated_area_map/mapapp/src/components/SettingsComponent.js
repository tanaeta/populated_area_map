import React, { useEffect } from 'react';
import moment from 'moment';
import PrefectureCheckboxComponent from './PrefectureCheckboxComponent.js';
import Slider from 'rc-slider';
import DateSlider from './DateSlider.js';
import CustomSlider from './CustomSlider.js';
import CustomRangeSlider from './CustomRangeSlider.js';

// 2020年から2025年までの月の配列を作成
const createMonthsArray = (startYear, endYear) => {
  const months = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push(parseInt(moment([year, month - 1]).format('YYYYMM')));
    }
  }
  return months;
};
const validMonths = createMonthsArray(2020, 2025);

// 2020年から2025年までの月の配列を作成
const createCustomMonthsArray = (startYear, endYear) => {
  const startDate = moment(new Date(startYear, 1, 1)).format('YYYY-MM-DD');
  const endDate = moment(new Date(endYear, 12, 31)).format('YYYY-MM-DD');
  const today = moment(new Date()).format('YYYY-MM-DD');
  const months = [];

  //2024年の各月のJSONサンプル
  const json = {
    "months": [
      {
        "month_name": "2024年1月",
        "startdate": "2024-01-01",
        "enddate": "2024-01-31"
      },
      {
        "month_name": "2024年2月",
        "startdate": "2024-02-01",
        "enddate": "2024-02-29"
      },
      {
        "month_name": "2024年3月",
        "startdate": "2024-03-01",
        "enddate": "2024-03-31"
      },
      {
        "month_name": "2024年4月",
        "startdate": "2024-04-01",
        "enddate": "2024-04-30"
      },
      {
        "month_name": "2024年5月",
        "startdate": "2024-05-01",
        "enddate": "2024-05-31"
      },
      {
        "month_name": "2024年6月",
        "startdate": "2024-06-01",
        "enddate": "2024-06-30"
      },
      {
        "month_name": "2024年7月",
        "startdate": "2024-07-01",
        "enddate": "2024-07-31"
      },
      {
        "month_name": "2024年8月",
        "startdate": "2024-08-01",
        "enddate": "2024-08-31"
      },
      {
        "month_name": "2024年9月",
        "startdate": "2024-09-01",
        "enddate": "2024-09-30"
      },
      {
        "month_name": "2024年10月",
        "startdate": "2024-10-01",
        "enddate": "2024-10-31"
      },
      {
        "month_name": "2024年11月",
        "startdate": "2024-11-01",
        "enddate": "2024-11-30"
      },
      {
        "month_name": "2024年12月",
        "startdate": "2024-12-01",
        "enddate": "2024-12-31"
      }
    ]
  };
  json.months.forEach(month => {
  const date = moment( new Date(month.startdate)).format('YYYY-MM-DD');
    if (date < today && date < endDate && date > startDate) {
      months.push({
        monthName: month.month_name,
        startDate: month.startdate,
        endDate: month.enddate
      });
    }
  });

  // startDateで昇順にソート
  months.sort((a, b) => {
    return a.startDate < b.startDate ? -1 : 1;
  });

  // monthsにindexを追加
  months.forEach((month, index) => {
    month.index = index;
  });

  return months;
};

const SettingsComponent = ({selectedPrefectures,setSelectedPrefectures,minPopulation,setMinPopulation,dateRange,setDateRange,customDate,setCustomDate,customDateRange,setCustomDateRange}) => {

  const customMonths = createCustomMonthsArray(2020, 2025);

  useEffect(() => {
    setCustomDate(customMonths[customMonths.length - 1]);
    setCustomDateRange([customMonths[customMonths.length - 1], customMonths[customMonths.length - 1]]);
  }, []);

  // スライダーの値が変更されたときのハンドラー
  const handlePopulationSliderChange = (value) => {
    setMinPopulation(value);
  };

  const handleDateSliderChange = (value) => {
    setDateRange(dateRange.map((date, index) => {
      return index === 1 ? date : value;
    }));
  };

  const handleCustomDateSliderChange = (value) => {
    setCustomDate(value);
  };

  const handleCustomRangeSliderChange = (value) => {
    setCustomDateRange(value);
  };

  // 日付のフォーマット
  const formatMonth = (value) => {
    return moment(value, 'YYYYMM').format('YYYY-MM');
  };
  const formatDate = (value) => {
    return moment(value, 'YYYYMMDD').format('YYYY-MM-DD');
  };

  return(
    <>
      {/** スライダー */}
      <div>
        {/** 人口スライダー */}
        <div style={{ margin: '20px' }}>
          <h3>Population Filter</h3>
          <Slider
            min={0}
            max={20000000}
            defaultValue={0}
            onChange={handlePopulationSliderChange}
            railStyle={{ backgroundColor: 'gray' }}
            trackStyle={{ backgroundColor: 'blue' }}
            handleStyle={{ borderColor: 'blue' }}
          />
          <div>Minimum Population: {minPopulation}</div>
        </div>

        {/** 日付スライダー */}
        <div style={{ margin: '20px' }}>
          <DateSlider range
            onChange={handleDateSliderChange}
            min={new Date(2022, 1, 1)}
            max={new Date(2025, 12, 31)}
            defaultValue={new Date(2025, 12, 31)}
            />
          <div>
            Selected Range: {formatDate(dateRange[0])} - {formatDate(dateRange[1])}
          </div>
        </div>

        {/** カスタムスライダー */}
        <div style={{ margin: '20px' }}>
          <CustomSlider
            onChange={handleCustomDateSliderChange}
            min={customMonths[0]}
            max={customMonths[customMonths.length - 1]}
            defaultValue={customMonths[customMonths.length - 1]}
            steps={customMonths}
            />
          <div>
            Selected Range: {customDate.monthName} - {customMonths[customMonths.length - 1].monthName}
          </div>
        </div>

        {/** カスタム範囲スライダー */}
        <div style={{ margin: '20px' }}>
          <CustomRangeSlider
            onChange={handleCustomRangeSliderChange}
            min={customMonths[0]}
            max={customMonths[customMonths.length - 1]}
            defaultValue={[customMonths[customMonths.length - 1],customMonths[customMonths.length - 1]]}
            steps={customMonths}
            />
          <div>
            Selected Range: {customDateRange[0].monthName} - {customDateRange[1].monthName}
          </div>
        </div>
      </div>

      {/** 都道府県チェックボックス */}
      <PrefectureCheckboxComponent
        selectedPrefectures={selectedPrefectures}
        setSelectedPrefectures={setSelectedPrefectures}
      />
      Filters
    </>
  );

}

export default SettingsComponent;