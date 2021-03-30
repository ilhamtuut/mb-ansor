import Root from '../../root/Url';
import { Toast } from "native-base";
import { AsyncStorage } from "react-native";
import { NavigationActions } from 'react-navigation'
export function itemsHasErrored(bool: boolean) {
  return {
    type: "HOME_ITEMS_HAS_ERRORED",
    hasErrored: bool
  };
}
export function itemsIsLoading(bool: boolean) {
  return {
    type: "HOME_ITEMS_IS_LOADING",
    isLoading: bool
  };
}
export function itemsFetchDataSuccess(items: Object) {
  return {
    type: "HOME_ITEMS_FETCH_DATA_SUCCESS",
    items
  };
}
export function itemsFetchNewSuccess(news: Object) {
  return {
    type: "HOME_NEWS_FETCH_DATA_SUCCESS",
    news
  };
}
export function itemsFetchData(url: any, news: any ) {
  return dispatch => {
    dispatch(itemsFetchDataSuccess((url: any)));
    dispatch(itemsFetchNewSuccess((news: any)));
    dispatch(itemsIsLoading(false));
  };
}

export function fetchData() {
  return dispatch => {
    return fetch(Root.link_news + 'posts?_embed&categories=101&per_page=5', {
        method: 'GET',
        headers: {
          'Accept' : 'application/json'
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch(itemsFetchDataSuccess(responseJson));
        dispatch(getNews());
      })
      .catch((error) => {
        console.error(error);
      });
  };
}

export function getNews() {
  return dispatch => {
    return fetch(Root.link_news + 'posts?_embed&categories=3&per_page=5', {
      method: 'GET',
      headers: {
        'Accept' : 'application/json'
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch(itemsFetchNewSuccess(responseJson));
      dispatch(itemsIsLoading(false));
    })
    .catch((error) => {
      console.error(error);
    });
  };
}