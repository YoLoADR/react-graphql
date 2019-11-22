import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
// (4)
import { AUTH_TOKEN } from "../constants";
// (5)
const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;
// (5)
const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

class Login extends Component {
  state = {
    login: true,
    email: "",
    password: "",
    name: ""
  };

  render() {
    const { login, email, password, name } = this.state;
    return (
      <div>
        <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
        <div className="flex flex-colomn">
          {/* (2)*/}
          {!login && (
            <input
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          {/* (1)*/}
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />

          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Your email address"
          />
        </div>
        <div className="flex mt3">
          {/* (6) */}
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? "login" : "create account"}
              </div>
            )}
          </Mutation>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login ? "need to create an account ?" : "already have an account"}
          </div>
        </div>
      </div>
    );
  }
  // (3)
  _confirm = async data => {
    const { token } = this.state.login ? data.login : data.signup;
    this._saveUserData(token);
    this.props.history.push(`/`);
  };

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };
}

export default Login;

// (1) Un état est pour les utilisateurs qui ont déjà un compte et seulement besoin de se connecter. Dans cet état, le composant ne rendra que deux inputchamps pour que l'utilisateur fournisse leur emailet password. Remarquez que ce state.loginsera truedans ce cas.
// (2) Le deuxième état concerne les utilisateurs qui n'ont pas encore créé de compte et qui doivent donc encore s'inscrire. Ici, vous rendez également un troisième inputchamp où les utilisateurs peuvent fournir leurs name. Dans ce cas, state.loginsera false.

//(3) pour implémenter les mutations que nous devons envoyer pour la fonctionnalité de connexion. Après la mutation a été effectuée, vous stockez le retourné tokendans localStorage et naviguer vers le chemin racine.

// (4)  vous devez également fournir le constants.jsfichier que nous utilisons pour définir la clé des informations d'identification que nous stockons dans le navigateur localStorage.

// (5) Les deux mutations ressemblent beaucoup aux mutations que vous avez déjà vues auparavant. Ils prennent un certain nombre d'arguments et renvoient le tokenque vous pouvez attacher aux demandes ultérieures d'authentification de l'utilisateur (c'est-à-dire qu'ils indiquent qu'une demande est faite pour le compte de cet utilisateur). Vous allez apprendre à le faire.

// (6) Si l'utilisateur veut simplement se connecter, vous appelez le loginMutation, sinon vous utilisez le signupMutationet la mutation sera déclenchée sur l' onClickévénement de la div . Les mutations GraphQL reçoivent les valeurs email, passwordet les nameétats sous la forme de paramètres passés sur l' variablesaccessoire. Enfin, lorsque la mutation est terminée, nous appelons la _confirmfonction, en passant datacomme argument le résultat de la mutation.
