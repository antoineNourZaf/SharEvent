import axios from 'axios';

const initialState = {
    // les events recus
    items:[],
    loading: false,
}

const START_LOADING = 'START_LOADING';
const ITEMS_LOADED = 'ITEMS_LOADED';

export default function events(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        loading: true,
      }
    case ITEMS_LOADED:
      return {
        ...state,
        items: action.items,
        loading: false,
      }
    default:
      return state
  }
}

export const loadEvents = () => {
  return async (dispatch, getState) => {
    const state = getState();
    console.log(state);
    if (state.news.items.length > 0) {
      return;
    }

    dispatch({ type: START_LOADING });

    return axios.get('A REMPLIR !!!') // Mettre ici l'url du endpoint devant retourner les events des utilisateurs suivis
      .then(response => {
        dispatch({ type: ITEMS_LOADED, items: response.data })
      });
  }
}