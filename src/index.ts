import "reflect-metadata";
import {createConnection, getRepository } from "typeorm";
import {User} from "./entity/User";

const express = require('express');

const testRoutes = [
 {
    method:'get',
    url:"/ping",
    middlewares:[
        (req,res)=>{
            res.end("pong");
        }
    ]
 },
 {
    method:'get',
    url:"/test/:name",
    middlewares:[
        (req,res)=>{
            res.end(`hellow ${req.params.user}`);
        }
    ]
 },
 {
   method:'get',
   url:'/api/users',
   middlewares:[
       (req,res)=>{
           res.json({
               users:[1,2,3]
           })
       }
   ]
 },
 {
   method:'post',
   url:'/api/users',
   middlewares:[
       (req,res)=>{
           // to add user
           res.json({
               users:[1,2,3]
           })
       }
   ]
 }

];

const application = {
    server: express(),
    PORT: 3000,
    databaseConnection:null,
    _coreConfig:{
      allowedMethods:[
          'get','post','delete','put'
      ]
    },
    configDatabase:function(connection){
        if(!connection){
            throw new Error("Type Error:Requires a Valid database Connection");
        }
        this.databaseConnection = connection;
        
    },
    config: function (routes,PORT?){
        // set custom port if provided
        this.PORT = PORT || this.PORT;
        if(!Array.isArray(routes)){
          throw new Error("Type Error: Expecting an Array of Routes");
        }
        const Router = express.Router()
        for(const route of routes){
           const { method,url,middlewares }  = route;
           // TODO : validate methods
           if(typeof method !== 'string' || !this._coreConfig.allowedMethods.includes(method.toLocaleLowerCase())){
               throw new Error("Type Error: route method is not valid");
           }

           // binds database connection to the request to use it on route handlers
           const bindDatabaseConnection = (req,res,next)=> {
                //process connection
                req._dbconnection = this.databaseConnection;
                next();
           };

           Router[method](url,bindDatabaseConnection,...middlewares);

        }
        this.server.use(Router);
    },
    run:function(){
        if(!this.databaseConnection){
            throw new Error("Error:requires a valid database connection!")
        }
        const PORT = process.env.PORT || this.PORT;
        this.server.use(express.urlencoded({extended:false}));
        this.server.listen(PORT,()=>{
            console.log(`server started at port:${PORT}`);
        });
    }
};

(async()=>{
    try{
    const connection = await createConnection();
    application.configDatabase(connection);
    application.config(testRoutes);
    application.run();
    
    }catch(err){
      console.log(err);
    }
})()





