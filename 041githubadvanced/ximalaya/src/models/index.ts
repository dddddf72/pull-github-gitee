import home from './home'
import { DvaLoadingState } from 'dva-loading-ts';
const models = [home,category];
export type RootState = {
  home: typeof home.state;
  loading: DvaLoadingState;
}
export default models;

// import home,{HomeState} from './home'
// const models = [home]
// export type RootState = {
//   home:HomeState
// }
// export default models
