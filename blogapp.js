var express=require("express");
var blogapp=express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true,useUnifiedTopology: true});

blogapp.use(bodyParser.urlencoded({extended: true}));
blogapp.use(express.static("public"));
blogapp.set("view engine","ejs");
blogapp.use(expressSanitizer());
blogapp.use(methodOverride("_method"));

//MONGOOSE/MODEL config
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

//RESTFUL ROUTES
//INDEX ROUTE
blogapp.get("/",function(req,res){
    res.redirect("/blogs");
});

blogapp.get("/blogs",function(req,res){

    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!!");
        }else{
            res.render("blogindex",{blogs:blogs});
        }
    });
});
// NEW ROUTE
blogapp.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
blogapp.post("/blogs",function(req,res){
        // create blog
        console.log(req.body);
        req.body.blog.body=req.sanitize(req.body.blog.body)
        console.log("===============================================================");
        console.log(req.body);
        Blog.create(req.body.blog,function(err,newBlog){
            if(err){
                res.render("new");
            }else{
                res.redirect("/blogs");
            }

        });
});
// SHOW ROUTE
blogapp.get("/blogs/:id",function(req,res){
      Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          res.redirect("/blogs");
      }else{
          res.render("show",{blog:foundBlog});
      }
      });
});
//EDIT ROUTE
blogapp.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
blogapp.put("/blogs/:id",function(req,res){

           req.body.blog.body=req.sanitize(req.body.blog.body)

            Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
     if(err){
           res.redirect("/blogs");
            }else{
                res.redirect("/blogs/" + req.params.id);
            }
            });
});

//DELETE ROUTE

blogapp.delete("/blogs/:id",function(req,res){
    //destry blog
Blog.findByIdAndRemove(req.params.id,function(err,deleteBlog){
    if(err){
        res.redirect("/blogs");
    }else{
        res.redirect("/blogs");
    }
})
});
blogapp.listen(8080,function(){
    console.log("Blog website Server has started!!!");
});