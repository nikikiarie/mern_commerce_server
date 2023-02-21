const jwt = require("jsonwebtoken");

 const verifyToken = (req, res,next) => {
  const authHeader = req.headers.token;
console.log(authHeader);
  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err) return res.status(500).json('invalid token')
        req.user = user
        next()
    })
    
  } else {
    res.status(500).json("Youre not authenticated");
  }
};

 const verifyTokenAndUser = (req,res,next) =>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(500).json(`You're not allowed`)
        }
    })
}

 const verifyTokenAndAdmin = (req,res,next) =>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(500).json(`You're not allowed`)
        }
    })
}

module.exports = {verifyToken,verifyTokenAndAdmin,verifyTokenAndUser}