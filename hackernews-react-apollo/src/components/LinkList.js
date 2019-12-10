import React, { Component, Fragment } from "react";
import Link from "./Link";
import { Query } from "react-apollo";
import gql from "graphql-tag";

// vous créez la constante JavaScript appelée FEED_QUERYqui stocke la requête. La gqlfonction est utilisée pour analyser la chaîne de caractères qui contient le code GraphQL

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

//MOCK DATA
// const linksToRender = [
//   {
//     id: "1",
//     description: "Prisma turns your database into a GraphQL API 😎",
//     url: "https://www.prismagraphql.com"
//   },
//   {
//     id: "2",
//     description: "The best GraphQL client",
//     url: "https://www.apollographql.com/docs/react/"
//   }
// ];

class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  };

  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ loading, error, data }) => {
          console.log("data", data, error);
          if (loading) return <div>Fetching</div>;
          if (error) return <div>Error</div>;

          const linksToRender = data.feed.links;

          return (
            <div>
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  link={link}
                  index={index}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                />
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}

// vous encapsulez le code renvoyé avec le <Query />composant en FEED_QUERYtant que prop.

export default LinkList;
