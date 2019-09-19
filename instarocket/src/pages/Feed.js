import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import io from 'socket.io-client';

import api from '../services/api';

import cameraImage from '../assets/camera.png';
import moreImage from '../assets/more.png';
import likeImage from '../assets/like.png';
import commentImage from '../assets/comment.png';
import sendImage from '../assets/send.png';

Feed.navigationOptions = ({navigation}) => ({
  headerRight: (
    <TouchableOpacity
      style={{marginRight: 20}}
      onPress={() => navigation.navigate('New')}>
      <Image source={cameraImage} />
    </TouchableOpacity>
  ),
});

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [newPost, setNewPost] = useState(null);
  const [likedPost, setLikedPost] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      const response = await api.get('/posts');

      setFeed(response.data);
    }

    loadPosts();
  }, []);

  useEffect(() => {
    const socket = io('https://instarocket-b.herokuapp.com');

    socket.on('post', newPost => setNewPost(newPost));
    socket.on('like', likedPost => setLikedPost(likedPost));
  }, []);

  useEffect(() => {
    if (newPost) {
      setFeed([newPost, ...feed]);
      setNewPost(null);
    }
  }, [newPost, feed]);

  useEffect(() => {
    if (likedPost) {
      setFeed(
        feed.map(post => (post._id === likedPost._id ? likedPost : post)),
      );
      setLikedPost(null);
    }
  }, [likedPost, feed]);

  async function handleLike(id) {
    await api.post(`/posts/${id}/like`);
  }

  function renderItem(item) {
    return (
      <View style={styles.feedItem}>
        <View style={styles.feedItemHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{item.author}</Text>
            <Text style={styles.place}>{item.place}</Text>
          </View>

          <Image source={moreImage} />
        </View>

        <Image style={styles.feedImage} source={{uri: item.image_url}} />

        <View style={styles.feedItemFooter}>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.action}
              onPress={() => handleLike(item._id)}>
              <Image source={likeImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={() => {}}>
              <Image source={commentImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={() => {}}>
              <Image source={sendImage} />
            </TouchableOpacity>
          </View>

          <Text style={styles.likes}>{item.likes} curtidas</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.hashtags}>{item.hashtags}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={post => post._id}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },

  feedItem: {
    marginTop: 20,
  },

  feedItemHeader: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 14,
    color: '#000',
  },

  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15,
  },

  feedItemFooter: {
    paddingHorizontal: 15,
  },

  actions: {
    flexDirection: 'row',
  },

  action: {
    marginRight: 8,
  },

  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
  },

  description: {
    lineHeight: 18,
    color: '#000',
  },

  hashtags: {
    color: '#7150c1',
  },
});
