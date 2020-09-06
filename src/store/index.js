import reducers from "../modules";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";

let store = null;
const reducer = combineReducers(reducers);

if (__DEV__) {
  const devToolsEnhancer = require("remote-redux-devtools");
  store = createStore(
    reducer,
    {},
    compose(
      applyMiddleware(thunk),
      devToolsEnhancer.default({
        realtime: true,
        hostname: "localhost",
        port: 8000,
        suppressConnectErrors: false,
      }),
    ),
  );
} else {
  store = createStore(
    reducer,
    {},
    applyMiddleware(thunk),
  );
}

export default store;