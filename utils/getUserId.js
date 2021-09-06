import jwt from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  const authHeader = request.request.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret");
    return decoded.id;
  }

  if(requireAuth) {
    throw new Error("Authentication required");
  }

  return null;
};

export { getUserId as default };
