const express = require("express");
const bodyParser = require("body-parser");
const date = require( __dirname + "/date.js")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// for using EJS
app.set("view engine", "ejs")

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function (req, res) {
    // console.log(date.getDate());
    // console.log(date.getDay());

    // const day = date.getDay();
    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
    let item = req.body.addItems;
    
    if(req.body.list === "Work List"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }

});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function () {
    console.log("Server has started on port 3000");
})