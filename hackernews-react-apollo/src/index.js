import React from "react";
import ReactDOM from "react-dom";
//encapsuler leApp avec BrowserRouter afin que tous les composants enfants de Appaient accès à la fonctionnalité de routage.
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
//(1)
import { setContext } from "apollo-link-context";
import { AUTH_TOKEN } from "./constants";

const httpLink = createHttpLink({
  uri: "http://localhost:4000"
});

// (3)
const authLink = setContext((_, { headers }) => {
  // (2)
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

//instanciez ApolloClienten passant le httpLinket une nouvelle instance de InMemoryCache.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// vous rendez le composant racine de votre application React. Le Appest encapsulé avec le composant d'ordre supérieur ApolloProviderqui est transmis clientcomme accessoire.
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//(1) Ce middleware sera appelé chaque fois ApolloClientqu'une requête sera envoyée au serveur. Les liens Apollo vous permettent de créer middlewareset vous permettent de modifier les demandes avant qu’elles ne soient envoyées au serveur.
// (2) nous obtenons l'authentification à tokenpartir localStoragesi elle existe; après cela, nous retournons le headersà la contextpour httpLinkpouvoir les lire.
// (3) toutes vos demandes d'API seront authentifiées si une tokenest disponible.
