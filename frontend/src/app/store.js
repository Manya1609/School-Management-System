import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../reducers/adminCounter";

export default configureStore({
    reducer: {
        counter: counterReducer,
    },
});
