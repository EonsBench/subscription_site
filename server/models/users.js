const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {isEmail} = require('validator');

const UserSchema = new mongoose.Schema({
    username:{type: String,required: true,unique: true},
    email:{type: String,required: true,unique: true, validate: [isEmail, '유효하지 않은 이메일입니다.']},
    password:{type: String,required: true},
    isContentCreator:{type: Boolean, default: false},
    date:{type: Date,default: Date.now}
});
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', UserSchema);