const express = require('express');
const passport = require('passport');
const Post = require('../models/posts');
const File = require('../models/files');
const User = require('../models/users');
const Creator = require('../models/creators');
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
router.post('/upload', passport.authenticate('jwt', {session: false}), upload.single('media'), async (req, res)=>{
    try{
        const creator = await Creator.findOne({user_id: req.user._id});
        if(!creator){
            return res.status(403).send('권한이 없습니다.');
        }
        const {title, content} = req.body;
        const post = new Post({
            title,
            content,
            creator_id: creator._id,
        });
        await post.save();

        if(req.files){
            for(const file of req.files){
                const fileDoc = new File({
                    post_id: post._id,
                    file_path: `uploads/${file.filename}`,
                });
                await fileDoc.save();
            }
        }
        res.status(201).send('콘텐츠가 성공적으로 업로드되었습니다.');
    }catch(error){
        res.status(400).send('콘텐츠 업로드에 실패하였습니다.');
    }
});
router.get('/:username/posts', async (req, res)=>{
    try{
        const user = await User.findOne({username: req.params.username});
        if(!user){
            return res.status(404).send('크리에이터를 찾을 수 없습니다.');
        }
        const posts = await Post.find({creator: user._id});
        res.json(posts);
    }catch(error){
        res.status(400).send('콘텐츠를 불러오는 데 실패했습니다.');
    }
});
router.get('/posts/:contentId', async (req, res)=>{
    try{
        const post = await Post.findById(req.params.contentId);
        if(!post){
            return res.status(404).send('게시물을 찾을 수 없습니다.');
        }
        const files = await File.find({post_id: post._id});
        res.json({post, files});
    }catch(error){
        res.status(400).send('게시물을 불러오는 데 실패했습니다.');
    }
});
module.exports = router;