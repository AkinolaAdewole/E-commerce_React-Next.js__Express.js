import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log(req.cookies);

  if (token) {
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log(decoded);

          // Assuming the JWT contains the user's ID
          // const userId = decoded.userId;
          
          // Call next to pass control to the next middleware or route handler
          next();
      } catch (error) {
          // Handle any errors related to token verification
          console.error('Error in token verification:', error);
          res.status(401).send('Unauthorized');
      }
  } else {
      // Handle the case where there is no token in cookies
      res.status(401).send('Unauthorized');
  }
};


    export {protect};