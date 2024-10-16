import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema= mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password:{ type: String, required: true}
});


//before we save
// Encrypt password using bcrypt

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  // Match user entered password to hashed password in database, compare logIn password
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  const userModel = mongoose.model("user_assessment", userSchema);
  export default userModel;