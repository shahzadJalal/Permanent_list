import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import dotenv from 'dotenv';

const app=express();
const port=3000;
dotenv.config();

const db=new pg.Client({
    user:"your_user",
    host:"your_host",
    database:"your_database",
    password:"your_meranaam",
    port:your_port
});

db.connect(err=>{
    if(err){
        console.error("Connection error",err.stack);
    } else {
        console.log("Connected to the Database");
    }
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let items = [];

//Home page

app.get("/", async (req,res)=>{
    try {
        const result= await db.query("SELECT * FROM yourlist ORDER BY id ASC");
        items=result.rows;
        res.render("index.ejs",{
            listTitle: "Today",
            listItems: items
        });
    } catch (err){
        console.log(err);
    };
});

//to add

app.post("/add", async (req,res)=>{
    const item=req.body.newItem;
    try {
        await db.query("INSERT INTO yourlist (title) VALUES ($1)", [item]);
        res.redirect("/");
    } catch(err){
        console.log(err);
    };
});

//to update edit

app.post("/edit", async (req,res)=>{
    const title=req.body.updatedItemTitle;
    const id= req.body.updatedItemId;
    try {
        await db.query("UPDATE yourlist SET title=($1) WHERE id=($2)",[title,id]);
        res.redirect("/");
    } catch(err){
        console.log(err);
    };
});

//to delete 

app.post("/delete", async (req,res)=>{
    const id= req.body.deleteItemId;
    try {
        await db.query("DELETE FROM yourlist WHERE id=($1)", [id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    };
});

app.listen(port, ()=>{
    console.log(`Server running on the port: ${port}`);
});