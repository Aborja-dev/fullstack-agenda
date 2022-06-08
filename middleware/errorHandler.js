const errorMiddleware = (err,req,res,next)=>{
   const errName = err.constructor.name
   switch (errName) {
      case 'MongoServerError':
         res.status(400).json({status: 'failed', errorMsg: `El nombre ${err.keyValue.name} ya existe`})
         break;
      default:
         res.status(400).json({err})
         break;
   }
}

module.exports = errorMiddleware