import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider, lightTheme } from "@adobe/react-spectrum"; // Import Provider and lightTheme
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import store from "./app/store";
import { Provider as ReduxProvider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider theme={lightTheme} colorScheme="light">
        <ReduxProvider store={store}>
            <AuthProvider>
                {/* <UserProvider> */}
                    <App />
                {/* </UserProvider> */}
            </AuthProvider>
        </ReduxProvider>
    </Provider>
);

reportWebVitals();
