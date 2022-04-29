import dayjs from "dayjs"
import 'dayjs/locale/zh-cn'
import duration from 'dayjs/plugin/duration'
import find from "lodash/find"
import get from "lodash/get"
import map from "lodash/map"
import includes from "lodash/includes"
import each from "lodash/each"
import {View, Image} from '@tarojs/components'

import maps from "../data/maps.json"
import weapons from "../data/weapons.json"
import rotations from '../data/rotations.json'
import hats from '../data/gear-hats.json'
import clothes from '../data/gear-clothes.json'
import shoes from '../data/gear-shoes.json'

function importAll(r) {
  let images = {};
  r.keys().map(item => { images[item.replace('./', '')] = r(item); });
  return images;
}
const mapImages = importAll(require.context('/assets/stages', false, /\.jpg/))
const weaponsImages = importAll(require.context('/assets/weapons', false, /\.png/))


dayjs.locale('zh-cn')
dayjs.extend(duration)

const weaponsMap = {}
each(rotations.Phases, rotation => {
  each(rotation.WeaponSets, weapon => {
    weaponsMap[weapon] = true
  })
})

export default function Card({phase, index}) {
  const reward = find(rotations.MonthlyRewardGears, {DateTime: phase.StartDateTime})
  const rewardType = reward.GearKind
  let database
  switch (rewardType) {
    case 'cHead':
      database = hats
      break
    case 'cShoes':
      database = shoes
      break
    case 'cClothes':
      database = clothes
      break
  }

  const rewardGear = get(find(database, {Id: reward.GearID}), 'ModelName')
  const start = dayjs(phase.StartDateTime + '+00:00')
  const end = dayjs(phase.EndDateTime + '+00:00')
  let remaining = null
  if (index === 0 && start.isBefore(dayjs())) {
    const diff = end.diff(dayjs())
    const duration = dayjs.duration(diff)
    remaining =
      <View>{`距离结束：${duration.days() > 0 ? `${duration.days()}天` : ''}${duration.hours() > 0 ? `${duration.hours()}小时` : ''}${duration.minutes()}分钟`}</View>
  }
  return <View className='card'>
    {remaining}
    <View>
      开始: {start.format('MM/DD (dd) HH:mm a')}
    </View>
    <View style={{marginBottom: 10}}>
      结束: {end.format('MM/DD (dd) HH:mm a')}
    </View>
    <View>
      <Image
        style={{width: '100%'}}
        mode='widthFix'
        src={mapImages[`${find(maps, {Id: phase.StageID}).MapFileName}.jpg`]}
      />
    </View>
    <View className='at-row'>
      {
        map(phase.WeaponSets, (weapon, index) => {
          let weaponName
          if (find(weapons, {Id: weapon})) {
            weaponName = `Wst_${find(weapons, {Id: weapon}).Name}`
          } else if (weapon === -1) {
            weaponName = 'questionmark'
          } else if (weapon === -2) {
            weaponName = 'questionmark2'
          }
          return <View key={index} className='at-col'>
            <Image
              style={{width: '90%', height: 0}}
              mode='widthFix'
              lazyLoad
              src={weaponsImages[`${weaponName}.png`]}
            />
          </View>
        })
      }
    </View>

    <View className='at-row'>
      {/* {
        rewardGear &&
        <Image
          className='at-col-3'
          mode='widthFix'
          style={{height: 0}}
          lazyLoad
          src={`https://woflow.gitee.io/salmonrun-rotation-static/gears/${rewardGear}.png`}
        />
      } */}
      {
        includes(phase.WeaponSets, -1) &&
        <Image
          className='at-col-3 at-col__offset-9'
          mode='widthFix'
          style={{height: 0}}
          lazyLoad
          src={weaponsImages[`Wst_${find(weapons, {Id: phase.RareWeaponID}).Name}.png`]}
        />
      }
    </View>

  </View>
}
