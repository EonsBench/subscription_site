const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
const {body, validationResult} = require('express-validator');
const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('유효하지 않은 이메일입니다.'),
    body('username').notEmpty().withMessage('사용자 이름을 입력해주세요.'),
    body('password')
    .isLength({min:8}).withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/[A-Z]/).withMessage('최소 하나의 대문자가 포함되어야 합니다.')
    .matches(/[0-9]/).withMessage('최소 하나의 숫자가 포함되어야 합니다.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('최소 하나의 특수문자가 포함되어야 합니다.'),
    ], async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {email, username, password, isContentCreator} = req.body;
        try{
            const user = new User({email, username, password, isContentCreator});
            await user.save();
            res.status(201).send('가입이 완료되었습니다.');
        }catch(error){
            res.status(400).send('가입에 실패하였습니다');
        }
});
router.post('/login', [
    body('email').isEmail().withMessage('유효하지 않은 이메일입니다.'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
], async (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
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