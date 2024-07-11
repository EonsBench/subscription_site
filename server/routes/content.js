const express = require('express');
const passport = require('passport');
const Content = require('../models/contents');
const router = express.Router();

router.post('/upload', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    if(!req.user.isContentCreator){
        return res.status(403).send('권한이 없습니다.');
    }
    const {title, description, mediaUrl} = req.body;
    try{
        const content = new Content({
            title,
            description,
            mediaUrl,
            creator: req.user._id
        });
        await content.save();
        res.status(201).send('콘텐츠가 성공적으로 업로드되었습니다.');
    }catch(error){
        res.status(400).send('콘텐츠 업로드에 실패하였습니다.');
    }
});
router.get('/channel/:creatorId', async (req, res)=>{
    try{
        const contents = await Content.find({creator: req.params.creatorId});
        res.json(contents);
    }catch(error){
        res.status(400).send('콘텐츠를 불러오는 데 실패했습니다.');
    }
});
module.exports = router;