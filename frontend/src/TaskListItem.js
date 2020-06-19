import React from "react";
import Config from "./config.js"
import { UserContext } from "./UserContext"
import { Link, Redirect } from "react-router-dom";

class TaskListItem extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { redirect: false, task: props.task };
    }

    completeTask = (task) => {
        let user = this.context;
        if (user) {
            task.task_status = "completed";
            this.setState({ loading: true, items: [] });
            fetch(Config.API_GATEWAY_URL, {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "X-Cognito-Token": user.id_token,
                }),
                body: JSON.stringify(task)
            })
            .then(() => this.setState({ redirect: true }))
            .catch((err) => console.error(err));
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/open" />
        }

        let task = this.state.task;
        let pill = (task.due_date) ? <span className="badge badge-pill badge-warning ml-3">{task.due_date.replace("T", " ")}</span> : "";

        if (task.task_status === "open") {
            return (
                <Link key={task.task_id} to={{ pathname: "/edit", state: task }} className="list-group-item list-group-item-action">
                    <div className="row">
                        <div className="col-sm-11">
                            <div className="mb-1">
                                <span className="h4">{task.task_label}</span>{pill}
                            </div>
                            <pre className="mb-1">{task.task_description}</pre>
                        </div>
                        <div className="col-sm-1">
                            <div className="float-right">
                                <button onClick={(e) => { this.completeTask(task); e.preventDefault(); return false; }} type="button" className="btn btn-outline-success">
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        }
        else {
            return (
                <div key={task.task_id} className="list-group-item list-group-item-action">
                    <div className="row">
                        <div className="col">
                            <span className="h5 mb-1">{task.task_label}</span>
                            <span class="badge badge-pill badge-success float-right">Completed on {task.updated.replace("T", " ").replace("Z", "")}</span>
                            <pre className="mb-1">{task.task_description}</pre>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
TaskListItem.contextType = UserContext;

export default TaskListItem;