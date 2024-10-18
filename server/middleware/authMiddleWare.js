import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log(req.cookies);

  if (token) {
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log(decoded);

          next();
      } catch (error) {
          console.error('Error in token verification:', error);
          res.status(401).send('Unauthorized');
      }
  } else {
      res.status(401).send('Unauthorized');
  }
};


    export {protect};