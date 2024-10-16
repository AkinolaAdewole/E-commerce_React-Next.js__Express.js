import userModel from '../models/UserModels.js'
import generateToken from '../utils/token.js';
import transactionModel from '../models/TransactionModel.js';
import walletModel from '../models/WalletModel.js';

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
  
  const getWallets = (req, res) => {
    // Use the walletModel (presumably a Mongoose model) to find data in the database that matches the conditions specified in req.body.
    walletModel.find(req.body, (err, result) => {
      if (err) {
        // If there's an error, typically a database error, send an error response.
        res.status(500).send({ error: 'Database error' });
      } else {
        // If the database query is successful, send the query result as the response.
        res.send(result);
      }
    });
  };

  const deleteWallet = (req, res) => {
    let { uid, wid } = req.body;
  
    // Find the user with the given ID (uid)
    userModel.findOne({ _id: uid }, (err, result) => {
      if (err) {
        // Handle database error if there's an issue finding the user
        res.status(500).send({ error: 'Database error' });
      } else {
        // Get the user's balance from the result
        let userBalance = result.balance;
  
        // Find the wallet with the given ID (wid)
        walletModel.findOne({ _id: wid }, (err, w_result) => {
          if (err) {
            // Handle database error if there's an issue finding the wallet
            res.status(500).send({ error: 'Database error' });
          } else {
            // Get the wallet's balance from the result
            let walletBalance = w_result.w_balance;
  
            // Calculate the new user balance by adding the wallet balance
            let newUserBalance = Number(userBalance) + Number(walletBalance);
  
            // Update the user's balance in the database
            userModel.findOneAndUpdate(
              { _id: uid },
              { balance: newUserBalance },
              { new: true },
              (err, wr_result) => {
                if (err) {
                  // Handle database error if there's an issue updating the user's balance
                  res.status(500).send({ error: 'Database error' });
                } else {
                  // Once the user's balance is successfully updated, delete the wallet
                  walletModel.findOneAndDelete({ _id: wid }, (err, result) => {
                    if (result) {
                      // If the wallet is successfully deleted, create a transaction record
                      let date = new Date().toLocaleDateString();
                      let newAlert = {
                        description: 'Deleted wallet Refund',
                        amount: walletBalance,
                        type: true,
                        date,
                        uid: uid,
                      };
                      let thisAlert = new transactionModel(newAlert);
                      thisAlert.save();
                    }
                  });
                }
              }
            );
          }
        });
      }
    });
  };

  const updateBalance = async (req, res) => {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: req.body.id },
        { balance: req.body.balance }, // Update the user's balance with the provided value
        { new: true }
      ).exec();
  
      // console.log(updatedUser);
      res.send(updatedUser); // Send the updated user document as a response
      console.log("updated"); // Log a success message
  
      // Create a new transaction record
      let newTransaction = {
        type: req.body.type,
        amount: req.body.amount,
        date: req.body.date,
        description: req.body.description,
        uid: req.body.id,
      };
  
      // Create a new instance of the transactionModel and save it to the database
      let form = new transactionModel(newTransaction);
      await form.save();
  
    //   console.log("Success");
    } catch (error) {
    //   console.error(error);
      res.status(500).send("Internal Server Error"); // Send an error response
    }
  };
  

  const getUserProfile=async(req,res)=>{
    const user = {
        _id:req.user._id,
        firstname:req.user.firstname,
        lastname:req.user.lastname,
        // email:req.user.email

    }
    res.status(200).json(user);
}

  
  const getTransactions = (req, res) => {
    transactionModel.find({ uid: req.body._id }, (err, result) => {
      if (err) {
        // console.log(err);
      } else {
        // console.log(result);
        res.send(result);
      }
    });
  };
  

  const transfer = (req, res) => {
    let received = req.body;
    let creditedUser;
    let debitObject = {
      description: received.descr,
      date: received.date,
      accountNo: received.accountNo,
      amount: received.amount,
      type: false,
      uid: received.id,
    };
  
    // Find the receiver's account based on the account number
    userModel.findOne({ acc_no: received.accountNo }, (err, result) => {
      if (err) {
        res.send({ message: "Account Number doesn't exist", err });
      } else {
        creditedUser = result;
  
        // Debit the sender's account
        userModel.findOneAndUpdate(
          { _id: received.id },
          { balance: received.balance },
          { new: true },
          (err, result) => {
            if (err) {
              console.log(err, "debit sender error");
            } else {
              // Credit the receiver's account
              let creditedUserBalance =
                Number(creditedUser.balance) + Number(received.amount);
  
              userModel.findOneAndUpdate(
                { _id: creditedUser._id },
                { balance: creditedUserBalance },
                (err, result) => {
                  if (err) {
                    console.log(err, "failed credit user");
                  } else {
                    // Credit alert for the receiver
                    let creditObject = {
                      description: received.descr,
                      date: received.date,
                      accountNo: received.accountNo,
                      amount: received.amount,
                      type: true,
                      uid: creditedUser._id,
                    };
                    let creditAlert = new transactionModel(creditObject);
                    creditAlert.save((err) => {
                      if (err) {
                        res.send(err);
                      } else {
                        res.send("done deal");
                      }
                    });
  
                    // Alert for the sender
                    let form = new transactionModel(debitObject);
                    form.save((error) => {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log("success");
                      }
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  };
  
  export {signin,getUserProfile, signup, getWallets, getTransactions, transfer, getDashboard, deleteWallet, updateBalance}