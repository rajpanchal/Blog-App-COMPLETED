var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));
app.use((methodOverride("_method")));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     name: "My new dog",
//     image: "https://farm8.staticflickr.com/7354/13958355955_c3b93b6971.jpg",
//     body: "This is one of the most cute dogs"
// });



app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//INDEX-ROUTE
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, allBlogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: allBlogs});
        }
    });
});

//NEW-ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

//CREATE-BLOG
app.post("/blogs", (req, res) => {
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.create(req.body.blogs, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blogs, (err, blog) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            console.log(req.body.blogs);
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, blog) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});


app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Server started');
});