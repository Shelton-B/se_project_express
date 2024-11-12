const { JWT_SECRET } = require("../utils/config");

const token = authorization.replace("Bearer ", "");

const payload = jwt.verify(token, JWT_SECRET);

req.user = payload;
next();
