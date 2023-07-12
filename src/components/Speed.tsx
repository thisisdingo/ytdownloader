import {useState} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import Popover from 'react-native-popover-view';

// Скорости
const speeds = [1, 0.9, 0.8, 0.7, 0.6];

const Speed: React.FC<{
  onSpeedRateChanged: (speedRate: number) => void;
  currentSpeed: number;
}> = ({onSpeedRateChanged, currentSpeed}) => {
  // Скорость видна
  const [speedPopoverIsVisible, setPopoverSpeedIsVisible] = useState(false);

  return (
    <Popover
      isVisible={speedPopoverIsVisible}
      onRequestClose={() => setPopoverSpeedIsVisible(false)}
      arrowSize={{height: -10, width: -10}}
      arrowShift={-1}
      popoverStyle={{borderRadius: 12}}
      from={
        <TouchableOpacity onPress={() => setPopoverSpeedIsVisible(true)}>
          <View
            style={{
              height: 27,
              width: 42,
              backgroundColor: '#212121',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}>
            <Text style={{color: 'white'}}>
              {currentSpeed.toFixed(1) + 'x'}
            </Text>
          </View>
        </TouchableOpacity>
      }>
      <View style={{flexDirection: 'row', backgroundColor: '#222222'}}>
        {speeds.map((speed, index) => {
          return (
            <View key={'speed_' + speed} style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  onSpeedRateChanged(speed);
                  setPopoverSpeedIsVisible(false);
                }}
                style={{flex: 1}}>
                <View
                  style={{
                    height: 44,
                    width: 54,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white'}}>{speed.toFixed(1) + 'x'}</Text>
                </View>
              </TouchableOpacity>
              {index != speeds.length - 1 ? (
                <View
                  style={{
                    width: 1,
                    height: '100%',
                    backgroundColor: '#4E4E4E',
                  }}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </Popover>
  );
};

export default Speed;
