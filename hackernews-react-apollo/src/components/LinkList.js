import React, { Component, Fragment } from "react";
import Link from "./Link";
import { Query } from "react-apollo";
import gql from "graphql-tag";

// vous créez la constante JavaScript appelée FEED_QUERYqui stocke la requête. La gqlfonction est utilisée pour analyser la chaîne de caractères qui contient le code GraphQL

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
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
              {linksToRender.map(link => (
                <Link key={link.id} link={link} />
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
