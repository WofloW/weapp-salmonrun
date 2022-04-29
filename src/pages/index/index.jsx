// import {Button} from 'taro-ui'
// import { usePageScroll, useReachBottom } from '@tarojs/taro' // Taro 专有 Hooks
// import { useState, useEffect } from 'react' // 框架 Hooks （基础 Hooks）
import { View, Text, Button } from '@tarojs/components'
import Rotations from './rotations'
import './index.scss'

export default function Counter({initialCount = 0}) {

  return (
    <View>
      <Rotations/>
    </View>
  );
}