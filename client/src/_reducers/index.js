import { combineReducers } from 'redux';
import user from './user_reducer';

// 기능별 Reducer를 rootReducer 하나로 합치는 함수
const rootReducer = combineReducers({
    user
})

export default rootReducer;