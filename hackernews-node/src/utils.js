// utilitaires réutilisés à quelques endroits.
const jwt = require("jsonwebtoken");
// Utilisé pour signer les JWT que vous publiez pour vos utilisateurs
const APP_SECRET = "GraphQL-is-aw3some";
// Cette getUserIdfonction est une fonction d'assistance que vous appellerez dans les résolveurs nécessitant une authentification (telle que post). Il récupère d’abord l’en- Authorizationtête (qui contient le UserJWT de) context. Il vérifie ensuite le JWT et en récupère l' UserID. Notez que si ce processus échoue pour une raison quelconque, la fonction lève une exception .

function getUserId(context) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId
};
