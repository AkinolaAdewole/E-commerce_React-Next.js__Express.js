import userModel from '../models/userModel.js'
import generateToken from '../utils/token.js';

const signup = async (req, res) => {
  try {
    const form = new userModel(req.body);
    await form.save();
    res.send({ message: "Signup Successful", response: true });
  } catch (err) {
    res.send({ response: false, message: err.message });
  }
};


  const signin = async(req, res)=>{
    let {email, password}= req.body;
    const user = await userModel.findOne({ email });
    
    if (user && (await user.matchPassword(password))){
      delete user.password;
      const token = generateToken(res,user);

        // Send the user data and token in the response
        
        res.json({ user,token, response: true, message: "" });
    }else{
        res.status(401);
        console.log('Invalid email or password')
        throw new Error('Invalid email or password')
    }
  }


  const getUserProfile=async(req,res)=>{
    const user = {
        _id:req.user._id,
        firstname:req.user.firstname,
        lastname:req.user.lastname,
        email:req.user.email

    }
    res.status(200).json(user);
}

  const getDashboard = async (req, res) => {
    const id = req.params.userId;
    try {
     const user = await userModel.findById(id)
     if (user) {
      // Remove the password field from the user document
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
    } catch (error) {
      console.error('Error in /user/dashboard route:', error);
      // Handle database errors and send an error response with a 500 status code
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export {signin,getUserProfile, signup,getDashboard}