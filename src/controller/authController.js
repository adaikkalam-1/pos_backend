const db = require('../../config/dbConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res)=>{
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"});
        }

        const user = await db("users").where({email}).first();
        if (!user) {
            return res.status(401).json({error: "Invalid email or password"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({error: "Invalid email or password"});
        }

        const token = jwt.sign({user_id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"});

        return res.status(200).json({message: "Login successful", data:{
            token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }});
    } catch (error) {
        console.error("login error:", error);
        return res.status(500).json({error: "Failed to login"});
    }
};



module.exports = {
    login,
}
