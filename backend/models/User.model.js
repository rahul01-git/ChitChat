const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const userModel = mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true,unique: true},
        password: {type: String, required: true,select:false},
        pic: {type: String,default:"https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png"},
    },{
        timestamps: true
    }
)

userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword,this.password)
}

userModel.pre("save",async function (next){
    if(!this.isModified){
        next()
    }
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password,salt)
})
const User = mongoose.model("User",userModel)
module.exports = User