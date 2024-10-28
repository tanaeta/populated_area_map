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

class CustomSlider extends React.Component {
  constructor(props) {
    super(props)
    // handleChangeメソッドをバインド
    this.handleChange = this.handleChange.bind(this);
    // 初期状態を設定
    this.state = { current: props.defaultValue || props.steps[props.steps.length - 1] };
    // スライダーのステップを設定
    this.steps = props.steps;
  }

  // スライダーの値が変更されたときに呼び出されるメソッド
  handleChange(value) {
    const { onChange } = this.props;

    // 新しいステップを計算
    const nextStep = this.props.steps[value];

    // 親コンポーネントに変更を通知
    onChange(nextStep);

    // 状態を更新
    this.setState({ currentStep: nextStep });
  }

  render() {
    const { currentStep } = this.state;
    // 現在のスライダーの値を取得
    const value = currentStep ? currentStep.index : this.steps.length - 1;

    return (
      <Slider
        style={styles.slider}
        max={this.steps.length - 1}
        value={value}
        onChange={this.handleChange}
        step = {1}
        keyboard={true}
        railStyle={{ backgroundColor: 'blue' }}
        trackStyle={{ backgroundColor: 'gray' }}
        handleStyle={{ borderColor: 'blue' }}
      />
    )
  }
}

export default CustomSlider;