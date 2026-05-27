import { configureStore } from '@reduxjs/toolkit'
import undoable, { excludeAction, StateWithHistory } from 'redux-undo'
import userReducer, { UserStateType } from './userReducer'
import componentsReducer, { ComponentsStateType } from './componentsReducer'
import pageInfoReducer, { PageInfoType } from './pageInfoReducer'
export type StateType = {
  user: UserStateType
  // components: ComponentsStateType
  components: StateWithHistory<ComponentsStateType> //增加undo
  pageInfo: PageInfoType
}
export default configureStore({
  reducer: {
    user: userReducer,
    //没有undo
    // components: componentsReducer,

    //增加了undo
    components: undoable(componentsReducer, {
      limit: 20, //限制undo20步
      filter: excludeAction([
        'components/resetComponents',
        'components/changeSelectedId',
        'components/selectPrevComponent',
        'components/selectNextComponent',
      ]),
    }),
    pageInfo: pageInfoReducer,
  },
})
