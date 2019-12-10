async function feed(parent, args, context, info) {
  // Si "argument de filtre" on construit un ~ WHERE en SQL
  const where = args.filter
    ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
    : {};
  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });
  const count = await context.prisma
    .linksConnection({
      where
    })
    .aggregate()
    .count();
  return {
    links,
    count
  };
}

async function getBookings(parent, args, context, info) {
  // Si "argument de filtre" on construit un ~ WHERE en SQL
  const where = args.filter
    ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
    : {};
  const bookings = await context.prisma.bookings({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });
  const count = await context.prisma
    .bookingsConnection({
      where
    })
    .aggregate()
    .count();
  return {
    bookings,
    count
  };
}

module.exports = {
  feed,
  getBookings
};

// Vous utilisez d’abord les arguments de filtrage, d’ordre et de pagination fournis pour extraire un certain nombre d’ Linkéléments.
// Ensuite, vous utilisez la linksConnectionrequête de l'API client Prisma pour extraire le nombre total d' Linkéléments actuellement stockés dans la base de données.
// Les linkset countsont ensuite encapsulés dans un objet pour adhérer au Feedtype que vous venez d'ajouter au schéma GraphQL.
