const express = require('express')

const bodyParser = require('body-parser')

const leadRouter = express.Router()

leadRouter.use(bodyParser.json())


leadRouter.route('/')
.all((req , res ,next)=>{
    res.statusCode =200
    res.setHeader('Content-Type','text/plain')
    // when we modify the req/res here and call next() 
    //the modified obj are carried on to next calls
    next()
})
.get((req , res ,next)=>{
    res.end('The promotions are being made will send you soon!')
} )
.post((req , res ,next)=>{
    res.end('Will add the promotion ' +req.body.name +' with deatials ' +req.body.description)

} )
.put((req , res ,next)=>{
    res.statusCode =403
    res.end('PUT operatoin not supported on /promotions')

} )

.delete((req , res ,next)=>{
    res.end('Deleting all the promotions!')
} )

leadRouter.route('/:promId')
.all((req , res ,next)=>{
    res.statusCode =200
    res.setHeader('Content-Type','text/plain')
    // when we modify the req/res here and call next() 
    //the modified obj are carried on to next calls
    next()
})
.get((req , res ,next)=>{
    res.end('The promotions are being made will send '+req.params.promId+' you soon!')
} )
.post((req , res ,next)=>{
    res.statusCode =403
    res.end('POST operatoin not supported on /promotions/:'+req.body.name)

} )
.put((req , res ,next)=>{
    res.end('Will update the promotion ' +req.body.name +' with deatials ' +req.body.description)
} )

.delete((req , res ,next)=>{
    res.end('Deleting all the promotions!')
} )

module.exports =leadRouter
