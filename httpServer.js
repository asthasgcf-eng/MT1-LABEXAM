import http from 'http';
import fs from 'fs';

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

const server = http.createServer((req, res) => {

    if (req.url === '/' && req.method === 'GET') {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end("<h1>Welcome to Employee Task Management</h1>");

    }

    else if (req.url === '/tasks' && req.method === 'GET') {

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(tasks));

    }

    else if (req.url === '/about' && req.method === 'GET') {

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end("Employee Task Management Application");

    }

    else if (req.url === '/home' && req.method === 'GET') {

        fs.readFile('./public/index.html', 'utf8', (err, data) => {

            if (err) {

                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end("Error reading HTML file");

            }

            else {

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(data);

            }

        });

    }

    else if (req.url === '/add-task' && req.method === 'POST') {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {

            try {

                const newTask = JSON.parse(body);

                tasks.push(newTask);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));

            }

            catch (error) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));

            }

        });

    }

    // PUT - Update Task
    else if (req.url.startsWith('/update-task/') && req.method === 'PUT') {

        const id = Number(req.url.split('/')[2]);

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            const task = tasks.find(t => t.id === id);

            if (!task) {
                res.writeHead(404);
                return res.end("Task Not Found");
            }

            const updatedData = JSON.parse(body);

            Object.assign(task, updatedData);

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                message: "Task Updated Successfully",
                task: task
            }));

        });

    }

    // DELETE - Delete Task
    else if (req.url.startsWith('/delete-task/') && req.method === 'DELETE') {

        const id = Number(req.url.split('/')[2]);

        const index = tasks.findIndex(t => t.id === id);

        if (index === -1) {
            res.writeHead(404);
            res.end("Task Not Found");
        }

        else {

            const deletedTask = tasks.splice(index, 1);

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                message: "Task Deleted Successfully",
                task: deletedTask[0]
            }));

        }

    }

    // Invalid Route
    else {

        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end("404 - Page Not Found");

    }

});

server.listen(4000, () => {

    console.log("HTTP Server running at http://localhost:4000");

});