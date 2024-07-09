const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
const router = express.Router();

router.post('/register', async (req, res)=>{
    const {email, username, password, isContentCreator} = req.body;
    try{
        const user = new User({email, username, password, isContentCreator});
        await user.save();
        res.status(201).send('가입이 완료되었습니다.');
    }catch(error){
        res.status(400).send('가입에 실패하였습니다');
    }
});
router.post('/login', async (req, res, next)=>{
    passport.authenticate('local', {session: false}, (err, user, info) =>{
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(400).json({
                message: info ? info.message : '올바르지 않는 계정입니다.',
            });
        }
        req.login(user, {session: false}, (err)=>{
            if(err){
                res.next(err);
            }
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY,{
                expiresIn: '1h',
            });
            return res.json({token});
        });
    })(req, res, next);
});
router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res)=>{
    res.send('보호된 연결입니다.');
});
module.export = router;