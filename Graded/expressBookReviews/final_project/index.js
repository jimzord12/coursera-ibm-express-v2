const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

require("dotenv").config();

// console.log("JWT Secret: ", process.env.JWT_SECRET);
// console.log("JWT Expiry: ", process.env.JWT_EXPIRY);
const app = express();

app.use(express.json());

// Using express-session middleware
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  if (!req.session.authorization) {
    return res.status(403).json({ message: "Forbidden, No Authorization" });
  }
  const { accessToken } = req.session.authorization;
  if (!accessToken) {
    return res.status(403).json({ message: "Forbidden, No Access Token" });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, data) => {
    if (!err) {
      req.user = data;
      console.log("Token's Data: ", data);
      next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(process.env.PORT || PORT, () => console.log("Server is running"));
