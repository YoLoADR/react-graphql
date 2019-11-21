import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = createHttpLink({
  uri: "http://localhost:4000"
});

//instanciez ApolloClienten passant le httpLinket une nouvelle instance de InMemoryCache.
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

// vous rendez le composant racine de votre application React. Le Appest encapsulé avec le composant d'ordre supérieur ApolloProviderqui est transmis clientcomme accessoire.
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
