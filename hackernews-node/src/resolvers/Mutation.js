const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10);
  // 2
  const user = await context.prisma.createUser({ ...args, password });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user
  };
}

// Au lieu de créer un nouvel Userobjet, vous utilisez maintenant l' prismainstance client pour récupérer l' Userenregistrement existant à l' aide de l' emailadresse envoyée en tant qu'argument dans la loginmutation. Si aucune Useradresse e-mail n'a été trouvée, vous retournez une erreur correspondante.

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user
  };
}

async function vote(parent, args, context, info) {
  // 1 valider le JWT entrant avec la fonction d'assistance getUserId  Si c'est valide, la fonction retournera le userId de User qui fait la demande. Si le JWT n'est pas valide, la fonction lève une exception.
  const userId = getUserId(context);

  // 2 vérifier que le demandeur User n'a pas encore voté pour l'élément Link identifié par args.linkId.
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // 3 Si exists renvoie false, la createVoteméthode sera utilisée pour créer un nouveau Votequi est connecté à Useret Link.
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
}

function post(parent, args, context, info) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

function postBooking(parent, args, context, info) {
  const userId = getUserId(context);
  return context.prisma.createBooking({
    carType: args.carType,
    customer_name: args.customer_name
  });
}

function updateBooking(parent, args, context, info) {
  return context.prisma.updateBooking({
    where: { id: args.id },

    data: {
      tripdate: args.tripdate,
      trip_start_time: args.trip_start_time,
      trip_end_time: args.trip_end_time,
      customer_name: args.customer_name,
      carType: args.carType,
      vehicle_number: args.vehicle_number,
      driver_number: args.driver_number,
      passenger_number: args.passenger_number,
      kilometer_number: args.kilometer_number,
      hour_number: args.hour_number,
      day_number: args.day_number,
      pickupAddress: args.pickupAddress,
      pickupCity: args.pickupCity,
      dropAddress: args.dropAddress,
      dropCity: args.dropCity,
      driver_name: args.driver_name,
      status: args.status,
      discount: args.discount,
      payment_status: args.payment_status,
      createdAt: args.createdAt,
      comment: args.comment
    }
  });
}

function deleteBooking(parent, args, context, info) {
  return context.prisma.deleteBooking({ id: args.id });
}

module.exports = {
  signup,
  login,
  post,
  vote,
  postBooking,
  updateBooking,
  deleteBooking
};
