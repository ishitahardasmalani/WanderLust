const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../acproject/models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main().then(() =>{
    console.log("connected to DB");
}).catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req , res) =>{
    res.send("Hi , I am root");
});

//Index Route
app.get("/listings" , async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})

//New Route 
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs", );

})


//Show Route

app.get("/listings/:id", async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById( id );
    console.log(listing);
    res.render("listings/show.ejs", { listing });
})

//Create Route
app.post("/listings" , async(req, res)=>{
    //let {title , description , image , price , country , location} = req.body;
    //or create object in the form only 
    // let listing = req.body.listing;
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings")
    //console.log(listing);
})

//Update: Edit and Update Route 
app.get("/listings/:id/edit" , async(req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById( id );
    res.render("listings/edit.ejs", {listing});
})

app.put("/listings/:id", async(req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id", async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testListing" , async(req , res) =>{
//     let sampleListing = new Listing({
//         title: "New Villa",
//         description: "Hello!",
//         image: "",
//         price: 10000,
//         location: "Mumbai",
//         country: "India",
//    });

//    await sampleListing.save();
//    console.log("Sample was saved");
//    res.send("Successful");
// })

app.listen(5173, () => {
    console.log("server is listening to port 5173");
});