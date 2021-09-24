const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');


//create user
/**
 * 
 * @param { first_name, last_name, email, password, usernmae*} req 
 * @param {*} res 
 * @returns 
 */
const createUser = async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;
    try {
        const user = await User.findOne({ 
            where: {
                email: email
            }
         });
         //user exists, return error
         if(user) return res.status(400).json({
             status: 400,
             message: "You're already registered. Please login to your account"
         });

        //user does not exist, create user

        //hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        //add user to db
        const new_user = await User.create({ first_name, last_name, email: email.toLocaleLowerCase(), username, password: hash });
        await new_user.save();

        //return success message
        return res.status(200).json({
            status: 200,
            message: "Account created. Please proceed to login",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
}

//login
/**
 * 
 * @param {email, password} req 
 * @param {*} res 
 * @returns 
 */
const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
          where: {
            email: email
          }
        });
        //retur error if no user object
        if (!user || user === null) return res.status(401).json({
          status: 401,
          message: "Combination of username/password is incorrect"
        });
  
        //check password
        const isMatch = await bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Combination of username/password is incorrect" });
  
        //assign jwt token
        const token = await jwt.sign({ id: user.id }, process.env.JWTSEC);
        return res.status(200).json({
          status: 200,
          message: "Successfully logged in",
          user: {
            token: token,
            id: user.id,
            email: user.email,
            username: user.username
          }
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  }

//exports modules
module.exports = {
    createUser,
    login
}