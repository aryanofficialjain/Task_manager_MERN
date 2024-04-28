const express = require("express")
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose, Schema } = require("mongoose");
const PORT = process.env.PORT || 8000
require('dotenv').config();
const app = express();

// mongoose schema
const TodoSchema = new Schema({
    todo: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean
    }

})

const Todo = mongoose.model("todos", TodoSchema)

app.use(cors())
// mongodb connection
mongoose.connect(process.env.MONGODB_URL)
    .then((result) => console.log("MONGO DB IS CONNECTED ......"))
    .catch((err) => console.log(err))


// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// routes  
app.get('/', (req, res) => {
    res.send("Welcome to todo homepage")
})

// get all todos
app.get('/todo', async(req,res)=> {
    try {
        const findtodo = await Todo.find()
        if(findtodo){
            return res.status(200).json(findtodo)
        }
        else{
            return res.status(404).json({message: "Cannot find todos"})
        }
    } catch (error) {
        console.log("error while getting the todo", error)

    }

})

// add todo

app.post('/todo', async(req,res) => {
try {
        const {todo} = req.body
        const addtodo = await Todo.create({todo})
        if(addtodo){
            return res.status(200).json({message : "succesfully added the todo"})
        }
        else{
            return res.status(404).json({mesage: "cannot create todo"})
        }
} catch (error) {
    console.log("Error while adding todo", error)

}
})


// delete todo
app.delete('/todo/:id', async(req,res) => {
    try {
        const {id} = req.params
        const deletetodo = await Todo.findByIdAndDelete(id)
        if(deletetodo){
            return res.status(200).json({message: "succesfully delted todo", deletetodo, id})
        }
        else{
            return res.status(404).json({message: "cannot delete todo"})
        }
    } catch (error) {
        console.log("error while delete the todo", error)

    }
})

// update todo
app.put('/todo/:id', async(req,res) => {
    try {
        const {id} = req.params
        const {todo} = req.body
        // const {todo} = req.body
        console.log(todo)
    
        const updatetodo = await Todo.findByIdAndUpdate(id, {todo},{ new: true})
        if(updatetodo){
            return res.status(200).json({message: "succesfully updated the todo", updatetodo, todo, id})
        }
        else{
            return res.status(404).json({mesage: "cannot update todo", updatetodo, todo, id})
        }
    } catch (error) {
        console.log("error while updating the todo", error)
    }
})







app.listen(PORT, () => {
    console.log("Server is running .....")
})
