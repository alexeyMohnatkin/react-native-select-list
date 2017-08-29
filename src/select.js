import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, TouchableWithoutFeedback } from 'react-native';

import Caret from './caret';
import List from './list';
import Option from './option';

const window = Dimensions.get('window');

class Select extends Component {
  constructor(props) {
		super(props);

    this.onOptionPressed = this.onOptionPressed.bind(this);

    this.state = {
      visible: 0,
      listHeight: 0,
    }
  }

  // measureProps() {
  //   this.refs.select.measureInWindow((x, y, width, height) => {
  //     this.setState({
  //       select: {
  //         x: x,
  //         y: y,
  //         width: width,
  //         height: height,
  //       }
  //     });
  //   });
  // }

  onOptionPressed(value, text) {
    this.setState({
      visible: false,
      value: text,
    });

    this.props.onSelect(value, text);
		this.props.onBlur();
  }

  toggleVisibility() {
		const visible = this.state.visible ? 0 : 1;
		this.setState({ visible }, () => {
			if (visible) {
				this.props.onFocus();
			}
			if (!visible) {
				this.props.onBlur();
			}
		});
  }

  render() {
    const { padding, caret, options, value } = this.props;

    let offset = 2*padding;

    if (caret) {
      if (typeof(caret) !== "string") {
        try {
          offset += caret.props.style.width;
        } catch(error) {
          console.error('Add style with width and height to caret image.');
        }
      } else {
        offset += 15;
      }
		}

		const selectedOption = options.find(option => option.value === value);
		const label = selectedOption ? selectedOption.label : '';

    return (
      <View
        style={[styles.container, {zIndex: this.props.zIndex + this.state.visible, paddingBottom: this.state.visible && Platform.OS === 'android' ? this.props.listHeight : 0}]}>
        <TouchableWithoutFeedback
          onPress={this.toggleVisibility.bind(this)}
          >
          <View
            ref={(view) => { this.select = view; }}
            style={[styles.select, this.props.selectStyle, {paddingHorizontal: padding}]}
            >
            <Text
              style={[this.props.selectTextStyle, {width: 222 - offset}]}
              numberOfLines={1}
              lineBreakMode='tail'
            >{ label }</Text>
            <Caret element={caret} size={this.props.caretSize} color={this.props.caretColor} />
          </View>
        </TouchableWithoutFeedback>
        {
          this.state.visible ?
            <List
              style={this.props.listStyle}
              select={this.select}
              height={this.props.listHeight}
              position={this.props.listPosition}
              onOverlayPress={this.toggleVisibility.bind(this)}
              onOptionPressed={this.onOptionPressed}
              >
              { options.map((option, key) =>
								<Option value={option.value} key={key}>{option.label}</Option>
							) }
            </List>
            :
            null
        }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  select: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 40,
    backgroundColor: '#efefef',
    borderRadius: 2,
  },
  labelContainer: {
    justifyContent: 'center',
    height: 25,
    backgroundColor: 'transparent',
  },
});

Select.propTypes = {
  listHeight: React.PropTypes.number,
  listPosition: React.PropTypes.oneOf(['down', 'up']),
  padding: React.PropTypes.number,
  zIndex: React.PropTypes.number,
  onSelect: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
};

Select.defaultProps = {
  listHeight: 100,
  listPosition: 'down',
  padding: 10,
  zIndex: 999,
  onSelect: () => { },
  onFocus: () => { },
  onBlur: () => { },
};

module.exports = Select;
