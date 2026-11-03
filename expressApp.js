import express from 'express';

const app = express();

app.use(express.json());

// Employee Task Records
let tasks=[{
    id:1,
    taskName: "Develop Login Page",
    assignedTo: "Ruchi Singh",
    status: "Pending"
},
{
    id:2,
    taskName: "Create Homepage",
    assignedTo: "Mahi Agarwal",
    status: "Completed"
},
{
    id:3,
    taskName: "Test Backend API",
    assignedTo: "Astha Gupta",
    status: "Pending"
}];
// 1. GET ALL TASKS
app.get('/tasks', (req, res) => {

    res.status(200).json(tasks);

});

// 2. GET TASK BY ID
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    res.status(200).json(task);

});

// 3. POST - ADD NEW TASK
app.post('/tasks', (req, res) => {

    const newTask = req.body;

    if (!newTask.taskName || !newTask.assignedTo) {

        return res.status(400).json({
            message: "Task name and assigned person are required"
        });

    }

    newTask.id = tasks.length > 0
        ? Math.max(...tasks.map(t => t.id)) + 1
        : 1;

    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });

});

// 4. PUT - UPDATE TASK
app.put('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    tasks[index] = {
        ...tasks[index],
        ...req.body,
        id: id
    };

    res.status(200).json({
        message: "Task updated successfully",
        task: tasks[index]
    });

});

// 5. DELETE TASK
app.delete('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });

});

// EXTRA ROUTE - HOME
app.get('/', (req, res) => {

    res.send("Welcome to Employee Task Management API");

});

// START SERVER
app.listen(4000, () => {

    console.log("Express Server running on port 4000");

});