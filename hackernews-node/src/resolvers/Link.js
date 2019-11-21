//(1)
function postedBy(parent, args, context) {
  return context.prisma.link({ id: parent.id }).postedBy();
}
//(2)
function votes(parent, args, context) {
  return context.prisma.link({ id: parent.id }).votes();
}

module.exports = {
  postedBy,
  votes
};

// type Link {
//   id: ID!
//   description: String!
//   url: String!
//   postedBy: User //(1)
//   votes: [Vote!]! //(2)
// }
