import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { vscode } from "../utilities/vscode";

import { Button } from "./ui/button";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { convertChangesToXML } from "diff";

interface Task {
  id: string;
  name: string;
  branch: string;
  description: string;
}

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    vscode.postMessage({
      command: "listTasks",
    });

    const messageListener = (event: MessageEvent) => {
      const message = event.data;
      console.log("tasks.tsx", message);
      if (message.command === "listTasks") {
        setTasks(message.tasks);
      } else if (message.command === "taskCreated") {
        navigate(`/task/${message.taskId}`);
      }
    };

    window.addEventListener("message", messageListener);

    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          // if we're not on the main branch, ask user to confirm
          // TODO: implement this

          vscode.postMessage({
            command: "createNewTask",
            name: ["Zucchini", "Rutabega", "Tomato", "Cucumber", "Celery", "Lemon", "Artichoke"][
              Math.floor(Math.random() * 7)
            ],
          });
        }}
      >
        + New task
      </Button>
      <div className="grid grid-cols-2 gap-6 mt-4">
        {tasks.length === 0 && <p>No tasks</p>}
        {tasks.reverse().map((task) => (
          <Link to={`/task/${task.id}`} className="mr-4">
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>
                  {task.name}
                </CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{task.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div >
  );
}
