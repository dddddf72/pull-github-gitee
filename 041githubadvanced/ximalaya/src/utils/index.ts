
import { Dimensions } from "react-native";
// export const { width, height } = Dimensions.get('window')
// export const hp = (percentage: number) =>
//   Math.round((percentage * height) / 100)
// export const wp = (percentage: number) => Math.round((percentage * width) / 100)
// export const viewportWidth = width
// export const viewportHeight = height
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
// 根据百分比获取宽度
function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value)
}
function hp(percentage: number) {
  const value = (percentage * viewportHeight) / 100;
  return Math.round(value)
}
export { viewportWidth, viewportHeight, wp, hp };
