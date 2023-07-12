import {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
const search = require('../assets/search.png');
const close = require('../assets/close.png');

const Search: React.FC<{didLinkEntered: (link: string) => void}> = ({
  didLinkEntered,
}) => {
  const [link, setLink] = useState('');

  return (
    <View
      style={{
        backgroundColor: 'rgba(118, 118, 128, 0.24)',
        height: 46,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 25,
      }}>
      <Image
        source={search}
        style={{
          height: 20,
          width: 20,
          marginRight: 2,
        }}
      />
      <TextInput
        placeholder="Youtube link"
        placeholderTextColor={'#EBEBF5'}
        cursorColor={'#FF375F'}
        style={{color: 'white', flex: 1}}
        onChangeText={setLink}
        value={link}
        onSubmitEditing={() => {
          if (link.length != 0) {
            didLinkEntered(link);
          }
        }}
      />
      <TouchableOpacity onPress={() => setLink('')}>
        <Image
          source={close}
          style={{
            height: 20,
            width: 20,
            marginLeft: 2,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
