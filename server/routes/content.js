const express = require('express');
const passport = require('passport');
const Content = require('../models/contents');
const User = require('../models/users');
const multer = require('multer');
const path = require('path');
const router = express.Router();

function fileFilter(req, file, cb){
    const fileType = /jpeg|jpg|png|gif|bmp|webp|mp4|avi|mov|wmv|flv|mkv|mp3|wav|aac|flac|ogg/i.test(path.extname(file.originalname).toLowerCase());
    if(fileType){
        cb(null, true);
    }else{
        cb(new Error('허용되지 않는 파일 유형입니다.'));
    }
}
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024*1024*50},
    fileFilter: fileFilter
});
router.post('/upload', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    if(!req.user.isContentCreator){
        return res.status(403).send('권한이 없습니다.');
    }
    const {title, description} = req.body;
    const mediaUrl = req.file ? `uploads/${req.file.filename}` : null;
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
router.get('/:username/posts', async (req, res)=>{
    try{
        const user = await User.findOne({username: req.params.username, isContentCreator: true});
        if(!user){
            return res.status(404).send('크리에이터를 찾을 수 없습니다.');
        }
        const contents = await Content.find({creator: user._id});
        res.json(contents);
    }catch(error){
        res.status(400).send('콘텐츠를 불러오는 데 실패했습니다.');
    }
});
router.get('/posts/:contentId', async (req, res)=>{
    try{
        const content = Content.findById(req.params.contentId);
        if(!content){
            return res.status(404).send('게시물을 찾을 수 없습니다.');
        }
        res.json(content);
    }catch(error){
        res.status(400).send('게시물을 불러오는 데 실패했습니다.');
    }
});
module.exports = router;