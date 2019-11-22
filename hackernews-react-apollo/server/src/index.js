const { GraphQLServer } = require("graphql-yoga");
// (2) On attache l'instance prisma (le communiquant direct avec la DB) avec context pour que le resolver y est accès
const { prisma } = require("./generated/prisma-client");
const Subscription = require("./resolvers/Subscription");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Vote = require("./resolvers/Vote");

// Chaque champ de la définition de schéma est soutenu par une fonction de résolution ayant la responsabilité de renvoyer les données pour ce champ
// l'objet entrant "parent" est l'élément de la liste "links".
// l'argument context accède à prisma, prisma objet est en réalité une  instance Prisma client importée de la bibliothèque générée prisma-client. Cette instance nous permet d'acceder à notre base de donnée
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote
};

//Cela indique au serveur quelles opérations d'API sont acceptées et comment elles doivent être résolues.

// (2) Traduire les opérations GraphQL de l'API Prisma en fonctions JavaScript
// Au lieu d'attacher directement un objet, vous créez maintenant le contextcomme une fonction qui retourne le context. L'avantage de cette approche est que vous pouvez attacher la requête HTTP qui porte également la requête GraphQL entrante (ou la mutation) context. Cela permettra à vos résolveurs de lire l'en-tête Authorization et de valider si l'utilisateur qui a soumis la demande est éligible pour effectuer l'opération demandée.

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => {
    return {
      ...request,
      prisma
    };
  }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));

// (1) Vous envoyez la méthode createLink à partir de l'API client Prisma. En tant qu'arguments, vous transmettez les données que les résolveurs reçoivent via le paramètre args.
// Donc, pour résumer, le client Prisma expose une API CRUD pour les modèles de votre modèle de données que vous pouvez lire et écrire dans votre base de données. Ces méthodes sont générées automatiquement en fonction des définitions de votre modèle dans "datamodel.prisma"

// (2) le context gratuite objet qui est passé dans tous vos résolveurs GraphQL est en cours d'initialisation ici. Comme vous y attachez l’ prismainstance cliente lorsqu’il GraphQLServerest instancié, vous pouvez accéder context.prismaà vos résolveurs.
