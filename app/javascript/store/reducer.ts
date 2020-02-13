import { getType } from "typesafe-actions";

import { RootState, RootAction } from "./types";
import actions from "./actions";
import idStore from "../utils/id-store";

const defaultState: RootState = {
  entities: {
    manufacturers: {},
    camStyles: {},
    cams: {}
  },
  selectedCams: {},
  highlightedCams: {}
};

const reducer = (
  state: RootState = defaultState,
  action: RootAction
): RootState => {
  switch (action.type) {
    case getType(actions.fetchCamsAsync.success): {
      const { payload: entities } = action;
      return { ...state, entities };
    }
    case getType(actions.selectCamStyle): {
      const { cams } = state.entities.camStyles[action.payload];
      return {
        ...state,
        selectedCams: {
          ...state.selectedCams,
          ...cams.reduce((o, id) => {
            o[id] = 1;
            return o;
          }, {})
        }
      };
    }
    case getType(actions.deselectCamStyle): {
      const { cams } = state.entities.camStyles[action.payload];
      const selectedCams = {};
      Object.assign(selectedCams, state.selectedCams);
      cams.forEach(id => delete selectedCams[id]);
      return {
        ...state,
        selectedCams
      };
    }
    case getType(actions.selectCam): {
      return {
        ...state,
        selectedCams: {
          ...state.selectedCams,
          [action.payload]: (state.selectedCams[action.payload] || 0) + 1
        }
      };
    }
    case getType(actions.deselectCam): {
      const selectedCams = {};
      Object.assign(selectedCams, state.selectedCams);
      if (selectedCams[action.payload] > 1) {
        selectedCams[action.payload] -= 1;
      } else {
        delete selectedCams[action.payload];
      }
      return {
        ...state,
        selectedCams
      };
    }
    // case getType(actions.highlightCamStyle): {
    //   return {
    //     ...state,
    //     highlightedCams: state.entities.camStyles[action.payload].cams
    //   }
    // }
    case getType(actions.highlightCam): {
      return {
        ...state,
        highlightedCams: idStore(state.highlightedCams).set(
          action.payload,
          true
        )
      };
    }
    case getType(actions.unhighlightCam): {
      return {
        ...state,
        highlightedCams: idStore(state.highlightedCams).delete(action.payload)
      };
    }
    default: {
      return state;
    }
  }
};

export default (initialState: RootState) => (
  state = initialState,
  action: RootAction
) => reducer(state, action);
