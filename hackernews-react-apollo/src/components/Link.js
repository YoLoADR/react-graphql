import React, { Component } from "react";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

class Link extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <div className="flex mt2 item-start">
        <div className="flew items-center">
          <span className="gray">{this.props.index + 1}</span>
          {/* (1) */}
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ linkId: this.props.link.id }}
              // (4)
              update={(store, { data: { vote } }) => {
                this.props.updateStoreAfterVote(
                  store,
                  vote,
                  this.props.link.id
                );
              }}
            >
              {voteMutation => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.link.description} ({this.props.link.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes.length} votes | by {""}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : "Unknow"}{" "}
            {/* (2) */}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
        </div>
      </div>
    );
  }
}

export default Link;

// (1) vous rendrez le bouton upvote si un utilisateur est actuellement connecté - c'est ce que vous utilisez authTokenpour
// (2) Notez que vous utilisez également une fonction appelée timeDifferenceForDatequi reçoit les createdAtinformations pour chaque lien. La fonction prendra l'horodatage et la convertira en une chaîne plus conviviale, par exemple "3 hours ago".

// (3) Vous ajoutez la possibilité d'appeler l' voteMutationintérieur de notre composant fonctionnel en utilisant le <Mutation />composant (nous passons également VOTE_MUTATIONet en link.idtant qu'accessoires).

// (4) La updatefonction que vous transmettez en tant que prop au <Mutation />composant sera appelée directement après que le serveur a renvoyé la réponse. Il reçoit les données utiles de la mutation ( data) et du cache actuel ( store) en tant qu'arguments. Vous pouvez ensuite utiliser cette entrée pour déterminer un nouvel état pour le cache. Notez que vous êtes déjà en train de déstructurer la réponse du serveur et d’en extraire le votechamp. Très bien, vous savez maintenant quelle est cette updatefonction, mais la mise en oeuvre proprement dite se fera dans le composant parent de Link, qui est LinkList.
