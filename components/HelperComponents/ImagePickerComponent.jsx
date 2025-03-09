
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = forwardRef((props, ref) => {
  const [image, setImage] = useState(null);

  useImperativeHandle(ref, () => ({
    pickImage
  }));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // return (
  //   <View style={styles.container}>
  //     {image && <Image source={{ uri: image }} style={styles.image} />}
  //   </View>
  // );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default ImagePickerComponent;
