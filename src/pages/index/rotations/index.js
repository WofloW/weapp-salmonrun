import { useState } from 'react'
import map from 'lodash/map'
import filter from 'lodash/filter'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useReachBottom } from '@tarojs/taro'
import { View, Switch, Picker } from '@tarojs/components'
import concat from 'lodash/concat'
import take from 'lodash/take'
import includes from 'lodash/includes'

import rotations from '../data/rotations.json'
import Card from '../components/card'
import WEAPON_NAME from '../data/weapon-name'
import './index.scss'

const weaponOptions = map(WEAPON_NAME, (weapon) => {
  return {
    label: weapon.name,
    value: weapon.id
  }
})
weaponOptions.unshift({ label: '全部', value: null })

dayjs.locale('zh-cn')

let filtered = filter(rotations.Phases, (phase) => {
  const end = dayjs(phase.EndDateTime + '+00:00')
  return end.isAfter(dayjs())
})

export default function Rotations() {
  const [showNumber, setShowNumber] = useState(5)
  useReachBottom(() => {
    setShowNumber(showNumber + 5)
  })
  const [map0, setMap0] = useState(true)
  const [map1, setMap1] = useState(true)
  const [map2, setMap2] = useState(true)
  const [map3, setMap3] = useState(true)
  const [map4, setMap4] = useState(true)
  const [weaponIndex, setWeapon] = useState(0)

  let mapFiltered = filter(filtered, (rotation) => {
    if (map0 && rotation.StageID === 5000) {
      return true
    }
    if (map1 && rotation.StageID === 5001) {
      return true
    }
    if (map2 && rotation.StageID === 5002) {
      return true
    }
    if (map3 && rotation.StageID === 5003) {
      return true
    }
    if (map4 && rotation.StageID === 5004) {
      return true
    }
    return false
  })

  if (weaponIndex != 0) {
    const weapon = weaponOptions[weaponIndex].value
    mapFiltered = filter(mapFiltered, (rotation) => {
      const isContainWeapon = includes(concat(rotation.WeaponSets, rotation.RareWeaponID), parseInt(weapon))
      const isGoldWeaponRandom = includes(rotation.WeaponSets, -2)
      if (parseInt(weapon) > 20000) {
        return isContainWeapon || isGoldWeaponRandom
      }
      // RareWeaponID is always 20000 when there is no rare weapon
      // so double check it's green random
      if (weapon === '20000') {
        return (isContainWeapon && includes(rotation.WeaponSets, -1)) || isGoldWeaponRandom
      }
      return isContainWeapon
    })
  }
  const takeRotation = take(mapFiltered, showNumber)

  return (
    <View>
      <View style={{ margin: '10px 15px' }}>
        <View style={{ fontSize: 12, marginBottom: 10, textAlign: 'center' }}>夜风制作 打工qq群: 138151784</View>
        <View style={{ fontWeight: 400 }}>
          <View className='at-row' style={{ marginBottom: 10 }}>
            <View className='at-col-4'>
              <Switch type='checkbox' checked={map0} onChange={() => { setMap0(!map0) }} />破坝
            </View>
            <View className='at-col-4'>
              <Switch type='checkbox' checked={map1} onChange={() => { setMap1(!map1) }} />破船
            </View>
            <View className='at-col-4'>
              <Switch type='checkbox' checked={map2} onChange={() => { setMap2(!map2) }} />破屋
            </View>
          </View>
          <View className='at-row' style={{ marginBottom: 10 }}>
            <View className='at-col-4'>
              <Switch type='checkbox' checked={map3} onChange={() => { setMap3(!map3) }} />臭水沟
            </View>
            <View className='at-col-4'>
              <Switch type='checkbox' checked={map4} onChange={() => { setMap4(!map4) }} />破楼
            </View>
          </View>
          <View>
            <Picker mode='selector' range={map(weaponOptions, w => w.label)} onChange={(e) => { setWeapon(e.detail.value) }}>
              <View className='sr-picker'>武器选择：{weaponOptions[weaponIndex].label}</View>
            </Picker>
          </View>
        </View>

        {
          map(takeRotation, (phase, index) => {
            return <Card phase={phase} key={phase.StartDateTime} index={index} />
          })
        }
      </View>
    </View>
  )
}

