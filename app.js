const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://test:test123@cluster0.uhvml.mongodb.net/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit he + button to add a new item."
});

const item3 = new Item({
    name: " <--- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// for using EJS
app.set("view engine", "ejs")

const day = date.getDate();

app.get("/", function (req, res) {

    // console.log(date.getDate());
    // console.log(date.getDay());

    // const day = date.getDay();


    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Successfully saved to the db")
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", { listTitle: day, newListItems: foundItems })

        }

    });
});

app.post("/", function (req, res) {
    const itemName = req.body.addItems;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === day) {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
});

app.post("/delete", function (req, res) {
    let checkedItemId = req.body.checkbox;
    let listName = req.body.listName;

    console.log(listName)

    if (listName === day) {

        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Successfully deleted the checked Item.");
                res.redirect("/");
            }
        });
    }

    else{
        List.findOneAndUpdate({name : listName}, {$pull : {items : { _id : checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }


});

app.get("/:directory", function (req, res) {
    const customListName = _.capitalize(req.params.directory);


    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();

                res.redirect("/" + customListName)
            }
            else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items })
            }
        }
    });

});

app.get("/about", function (req, res) {
    res.render("about");
})

app.listen(3000, function () {
    console.log("Server has started on port 3000");
})