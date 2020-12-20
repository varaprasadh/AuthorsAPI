import "reflect-metadata";
import {createConnection, getRepository } from "typeorm";
import { Author } from "./entity/Author";
import { Book } from "./entity/Book";

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
    url:"/api/authors",
    middlewares:[
        async (req,res)=>{

            try{
                const authorRepo = getRepository(Author);
                const authors =  await authorRepo.find();
                return res.json({
                    authors
                });
            }catch(err){
                res.json({
                    error:"error"
                })
            }

        }
    ]
 },
 {
    method:'post',
    url:"/api/authors",
    middlewares:[
        async (req,res)=>{

            try{
                const { firstname, lastname } = req.body;
                const authorRepo = getRepository(Author);
                const newAuthor =  new Author();
                newAuthor.firstName = firstname;
                newAuthor.lastName = lastname;
                await authorRepo.save(newAuthor);

                res.json({
                    author: newAuthor
                });
                
            }catch(err){

               res.json({
                   error:"error"
               });
            }

        }
    ]
 },
 {
    method:'delete',
    url:"/api/authors",
    middlewares:[
        async (req,res)=>{

            try{
                const { id } = req.body;
                const authorRepo = getRepository(Author);
                const authorToDelete = await authorRepo.findOne(id);
                await authorRepo.remove(authorToDelete);
                res.json({
                    message: "author has been deleted",
                    author: authorToDelete
                });
            }catch(err){
                console.log(err);
               res.json({
                   error:"error"
               });
            }
        }
    ]
 },
 {
    method:'post',
    url:"/api/books",
    middlewares:[
        async (req,res)=>{
            try{
                const { author:authorId,title} = req.body;
                const authorRepo = getRepository(Author);
                const BookRepo = getRepository(Book);
                const author = await authorRepo.findOne(authorId);
                const newBook = new Book();
                newBook.title = title;
                newBook.author = author;
                await BookRepo.save(newBook);
                res.json({
                    book:newBook
                })
            }catch(err){
               res.json({
                   error:"error"
               });
            }

        }
    ]
 },
 {
    method:'get',
    url:"/api/books",
    middlewares:[
        async (req,res)=>{
            try{
               
                const BookRepo = getRepository(Book);
                const books = await BookRepo.find();

                res.json({
                    books
                })
            }catch(err){
               res.json({
                   error:"error"
               });
            }

        }
    ]
 },
 {
    method:'delete',
    url:"/api/books",
    middlewares:[
        async (req,res)=>{
             try{
                const { id } = req.body;
                 const BookRepo = getRepository(Book);
                const bookToDelete = await BookRepo.findOne(id);
                await BookRepo.remove(bookToDelete);

                res.json({
                    message: "book has been deleted",
                    book: bookToDelete
                });
                
            }catch(err){
               res.json({
                   error:"error"
               });
            }

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
        this.server.use(express.urlencoded({extended:false}));
        this.server.use(express.json());
        this.server.use(Router);
    },
    run:function(){
        if(!this.databaseConnection){
            throw new Error("Error:requires a valid database connection!")
        }
        const PORT = process.env.PORT || this.PORT;
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





