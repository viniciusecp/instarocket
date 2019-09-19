import React from 'react';
import {Image} from 'react-native';
import {createAppContainer, createStackNavigator} from 'react-navigation';

import Feed from './pages/Feed';
import New from './pages/New';

import logo from './assets/logo.png';

export default createAppContainer(
  createStackNavigator(
    {
      Feed,
      New,
    },
    {
      headerLayoutPreset: 'center', // forçar o titulo ficar no meio também no android
      defaultNavigationOptions: {
        headerTitle: <Image source={logo} />,
        headerBackTitle: null, // Tira a palavra back do botam voltar que aparece no IOS
        headerTintColor: '#000', // Cor do botão voltar
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
      },
      mode: 'modal', // por padrão a nova tela vem da direta pra esquerda, e modal faz vir de baixo para cima
    },
  ),
);
