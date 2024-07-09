const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/users');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
    {usernameField: 'email', passwordField: 'password'},
    async(email, password, done)=>{
        try{
            const user = await User.findOne({email});
            if(!user){
                return done(null, false, {message: '계정이 일치하지 않습니다.'});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return done(null, false, {message: '계정이 일치하지 않습니다.'});
            }
            return done(null, user);
        }catch(err){
            return done(err);
        }
    }
));

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done)=>{
    try{
        const user = await User.findById(jwt_payload.id);
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    }catch(err){
        return done(err, false);
    }
}));
module.exports = passport;