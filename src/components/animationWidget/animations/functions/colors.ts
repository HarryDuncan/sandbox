import {colors} from '../data/colors'
import {getRandomInt} from './math'



export const getRandomColor = () => {

  let color = colors[getRandomInt(colors.length)]
  return color['hexString']
}
