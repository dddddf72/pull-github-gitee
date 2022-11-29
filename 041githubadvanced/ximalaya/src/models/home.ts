import { RootState } from './index';
// import { Home } from '@/pages/Home';
import { HomeState } from './home';
import { Effect, Model } from "dva-core-ts";
// import { Model } from "dva-core-ts"
import { Reducer } from 'redux';
import axios from "axios";
const CAROUSEL_URL = 'mock/11/carousel';
const GUESS_URL = 'mock/11/guess';
const CHANNEL_URL = 'mock/11/channel';
export interface ICarousel {
  id: string;
  image: string;
  colors: [string, string]
}
export interface IGuess {
  id: string;
  title: string;
  image: string;
}
export interface IChannel {
  id: string;
  title: string;
  image: string;
  remark: string;
  played: number;
  playing: number;
}
export interface IPagination {
  current: number;
  total: number;
  hasMore: boolean;
}

export interface HomeState {
  carousels: ICarousel[];
  activeCarouselIndex:number;//当前轮播图下标
  gradientVisible:boolean;//渐变色组件是否显示的状态
  guess: IGuess[];
  channels: IChannel[];
  pagination: IPagination[];
  num: number;
  //   loading:boolean;
}
interface HomeModel extends Model {
  namespace: 'home';
  // state: HomeState;
  state: HomeState;
  reducers: {
    add: Reducer<HomeState>;
    setState: Reducer<HomeState>;
    // setStatus:Reducer<HomeState>;
  };
  effects: {
    asyncAdd: Effect;
    fetchCarousels: Effect;
    fetchGuess: Effect;
    fetchChannels: Effect;
  }

}

const initialState: HomeState = {
  carousels: [],
  activeCarouselIndex:0,
  gradientVisible:true,
  guess: [],
  channels: [],
  pagination: {
    current: 1,
    total: 0,
    hasMore: true,
  },
  num: 1,
  // loading:false,
};
// function delay(timeout: number) {
//   return new Promise(resolve => {
//     setTimeout((resolve, timeout))
//   });
// }
const homeModel: HomeModel = {
  namespace: 'home',
  state: initialState,
  reducers: {
    add(state = initialState, { payload }) {
      return {
        ...state,
        num: state.num + payload.num,
        // ...payload,
      };
    },
    setState(state = initialState, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // setStatus(state = interface ,{payload}){
    //   return {
    //     ...state,loading:payload.loading,
    //   };
    // },
  },
  effects: {

    // *asyncAdd({ payload }, { call, put }) {
    //   yield call(delay, 3000);
    //   yield put({
    //     type: 'add',
    //     payload,
    //   });
    // },

    // *fetchCarousels({payload},{call,put}){
    //   //改成下划线表示占位符，第一个是必传的参数 
    *fetchCarousels(_, { call, put }) {
      // yield put({
      //   type:'setStatus',
      //   payload:{
      //     loading:true,
      //   },
      // });

      // yield call(delay,3000)
      const { status, msg, data } = yield call(axios.get, CAROUSEL_URL);

      yield put({
        type: 'setState',
        payload: { carousels: data },
      });
    },
    *fetchGuess(_, { call, put }) {
      const { status, msg, data } = yield call(axios.get, GUESS_URL);

      yield put({
        type: 'setState',
        payload: { guess: data },
      });
    },
    *fetchChannels({ callback, payload }, { call, put, select }) {
      const { channels, pagination } = yield select((state: RootState) => state.home)
      let page = 1;
      if (payload && payload.loadMore) {
        page = pagination.current + 1;
      }
      const { status, msg, data } = yield call(axios.get, CHANNEL_URL,
        {
          params: {
            page,
          }
        }
      );
      let newChannels = data.results;
      if (payload && payload.loadMore) {
        newChannels = channels.concat(newChannels)
      }
      yield put({
        type: 'setState',
        payload: {
          channels: newChannels,
          pagination: {
            current: data.pagination.current,
            total: data.pagination.total,
            hasMore: newChannels.length < data.pagination.total,
          },
        },
      });
      if (typeof callback === 'function') {
        callback();
      }
    },
  },
};
export default homeModel;
