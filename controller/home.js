// need to go through logic of removeCart and updateCart again

const cart = require("../model/cart");
const Cart = require("../model/cart");
const CartInventory = require("../model/cartInventory");

exports.homeLayout = async (req, res) => {

    res.send(
        [
            { type: "banner" },
            { type: "list" },
            { type: "icon" },
            { type: "categories" },
            { type: "dishes" },
        ]
    );
};


exports.banner = async (req, res) => {

    res.send(
        [
            { type: "banner" },
            { type: "list" },
            { type: "icon" },
            { type: "categories" },
            { type: "dishes" },
        ]
    );
};




//type-List,Banner,Icon,Nortification,storesHorizantal,categories,Filters,storesVerticle,Dishes
//list - list of products, title
//banner - title, list of banner object - banner object - title,image url,list of product to open in view all,
//icon= title, list of icon object - icon object - title, image, route
//notification = title,message,iconRrl
//storesHorizantal = title, List of stores
//Categories = list of category model
//Filters=list of categories model
//storesVerticle = title, List of stores
//Dishes=title, list of product 
