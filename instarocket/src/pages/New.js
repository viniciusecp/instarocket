import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import api from '../services/api';

New.navigationOptions = {
  headerTitle: 'Nova publicação',
};

export default function New({navigation}) {
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [preview, setPreview] = useState(null);

  function handleSelectImage() {
    ImagePicker.showImagePicker(
      {
        title: 'Selecionar imagem',
      },
      upload => {
        if (upload.error) {
          console.debug('Error');
        } else if (upload.didCancel) {
          console.debug('Used canceled');
        } else {
          const preview = {
            uri: `data:image/jpeg;base64,${upload.data}`,
          };

          let prefix;
          let ext;

          if (upload.fileName) {
            // isso pq qnd tira foto no IOS, como ela ainda não existe, não tem nome
            [prefix, ext] = upload.fileName.split('.');
            ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
          } else {
            prefix = new Date().getTime();
            ext = 'jpg';
          }

          const image = {
            uri: upload.uri,
            type: upload.type,
            name: `${prefix}.${ext}`,
          };

          setPreview(preview);
          setImage(image);
        }
      },
    );
  }

  async function handleSubmit() {
    const data = new FormData();

    data.append('image', image);
    data.append('author', author);
    data.append('place', place);
    data.append('description', description);
    data.append('hashtags', hashtags);

    await api.post('/posts', data);

    navigation.navigate('Feed');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectButton} onPress={handleSelectImage}>
        <Text style={styles.selectButtonText}>Selecionar imagem</Text>
      </TouchableOpacity>

      {preview && <Image style={styles.preview} source={preview} />}

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Author do post"
        placeholderTextColor="#999"
        value={author}
        onChangeText={value => setAuthor(value)}
      />

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Local do post"
        placeholderTextColor="#999"
        value={place}
        onChangeText={value => setPlace(value)}
      />

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Descrição do post"
        placeholderTextColor="#999"
        value={description}
        onChangeText={value => setDescription(value)}
      />

      <TextInput
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Hashtags do post"
        placeholderTextColor="#999"
        value={hashtags}
        onChangeText={value => setHashtags(value)}
      />

      <TouchableOpacity style={styles.shareButton} onPress={handleSubmit}>
        <Text style={styles.shareButtonText}>Compartilhar imagem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});
