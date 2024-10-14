import React from 'react';
import Slider from 'rc-slider';

// スタイル定義
const styles = {
  slider: {
    width: 'calc(100% - 0px)',
    height: 30,
    padding: '5px 0 0 0',
    margin: '0 0 0 0px',
    zIndex: 2,
  }
};

class DateSlider extends React.Component {
  constructor(props) {
    super(props)
    // handleChangeメソッドをバインド
    this.handleChange = this.handleChange.bind(this);
    // 初期状態を設定
    this.state = { currentDate: props.value || props.defaultValue || props.min };
  }

  // スライダーの値が変更されたときに呼び出されるメソッド
  handleChange(value) {
    const { min } = this.props;

    // 新しい日付を計算
    const nextCurrentDate = new Date(min.getTime());
    nextCurrentDate.setDate(value);

    const { onChange } = this.props;
    // 親コンポーネントに変更を通知
    onChange(nextCurrentDate);

    // 状態を更新
    this.setState(prevState => ({ currentDate: nextCurrentDate }));
  }

  render() {
    const { currentDate } = this.state;
    const { min, max} = this.props;

    // スライダーのステップ数を計算
    const steps = Math.round((max - min) / (1000 * 60 * 60 * 24))
    // 現在のスライダーの値を計算
    const value = Math.round((currentDate - min) / (1000 * 60 * 60 * 24))

    return (
      <Slider
        style={styles.slider}
        max={steps}
        value={value}
        onChange={this.handleChange}
        step = {1}
        keyboard={true}
        railStyle={{ backgroundColor: 'gray' }}
        trackStyle={{ backgroundColor: 'blue' }}
        handleStyle={{ borderColor: 'blue' }}
      />
    )
  }
}

export default DateSlider;