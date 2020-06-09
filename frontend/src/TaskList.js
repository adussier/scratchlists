import React from 'react';
import { UserContext } from "./UserContext"
import { Link } from "react-router-dom";

class TaskList extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.tags = {};
        this.state = { loading: true, filter: props.filter, tag: "", items: [] };
    }

    componentDidMount() {
        setTimeout(() => {
            let user = this.context;
            if (user) {
                fetch(`https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists?task_status=${this.state.filter}&username=` + user.username, {
                    headers: new Headers({
                        "X-Cognito-Token": user.id_token,
                    })
                })
                .then((res) => res.json())
                .then((body) => {
                    this.parseHashtags(body.Items);
                    this.setState({ loading: false, filter: this.state.filter, items: body.Items.sort(this.sortItems) });
                })
                .catch((err) => console.error(err));
            }
            else {
                this.setState({ loading: false, filter: this.state.filter, items: [] });
            }
        }, 250);
    }

    sortItems(i1, i2) {
        if (i1.created < i2.created) return 1;
        else return -1;
    }

    updateModal(task) {
        let currentState = this.state;
        currentState.task_to_delete = task;
        this.setState(currentState);
    }

    deleteTask() {
        let user = this.context;
        if (user) {
            this.setState({ loading: true, items: [] });
            let task_id = this.state.task_to_delete.task_id;
            fetch("https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists?username=" + user.username + "&task_id=" + task_id, {
                method: "DELETE",
                headers: new Headers({
                    "X-Cognito-Token": user.id_token,
                })
            })
            .then(() => {
                fetch(`https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists?task_status=${this.state.filter}&username=` + user.username, {
                    headers: new Headers({
                        "X-Cognito-Token": user.id_token,
                    })
                })
                .then((res) => res.json())
                .then((body) => {
                    this.parseHashtags(body.Items);
                    this.setState({ loading: false, filter: this.state.filter, items: body.Items.sort(this.sortItems) });
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        }
        else {
            this.setState({ loading: false, filter: this.state.filter, items: [] });
        }
    }

    completeTask(task) {
        let user = this.context;
        if (user) {
            task.task_status = "completed";
            this.setState({ loading: true, items: [] });
            fetch("https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists", {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "X-Cognito-Token": user.id_token,
                }),
                body: JSON.stringify(task)
            })
            .then(() => {
                fetch(`https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists?task_status=${this.state.filter}&username=` + user.username, {
                    headers: new Headers({
                        "X-Cognito-Token": user.id_token,
                    })
                })
                .then((res) => res.json())
                .then((body) => {
                    this.parseHashtags(body.Items);
                    this.setState({ loading: false, filter: this.state.filter, items: body.Items.sort(this.sortItems) });
                })
                .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
        }
    }

    parseHashtags(tasks) {
        let allTags = {};
        tasks.forEach(task => {
            let words = task.task_description.split(/\s+/);
            let tags = words.filter(w => w.startsWith("#"));
            tags.forEach(tag => {
                if (tag in allTags) {
                    allTags[tag]++;
                }
                else {
                    allTags[tag] = 1;
                }
            });
        });
        this.tags = allTags;
    }

    selectTag(tag) {
        let state = this.state;
        state.tag = tag;
        this.setState(state);
    }

    render() {
        const title = (this.state.filter === "open") ? `My open ${this.state.tag} tasks` : "My completed tasks";

        const addButton = (this.state.filter === "open") ? <Link to="/edit" className="btn btn-primary mt-3">Add task</Link> : "";

        const tags = Object.keys(this.tags).map(tag =>
            <li key={tag} className="list-group-item d-flex justify-content-between align-items-center">
                <button type="button" className="btn btn-link" onClick={() => this.selectTag(tag)}>{tag}</button>
                <span className="badge badge-primary badge-pill">{this.tags[tag]}</span>
            </li>
        );

        const itemList = this.state.items.filter(task => task.task_description.includes(this.state.tag)).map(task => {
            let pill = (task.due_date) ? <span className="badge badge-pill badge-warning ml-2">{task.due_date.replace("T", " ")}</span> : "";

            if (task.task_status === "open") {
                return (
                    <Link key={task.task_id} to={{ pathname: "/edit", state: task }} className="list-group-item list-group-item-action">
                        <div className="row">
                            <div className="col-sm-1">
                                <div className="float-left">
                                    <button onClick={(e) => { this.completeTask(task); e.preventDefault(); return false; }} type="button" className="btn btn-outline-success">
                                        Done
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-10">
                                <div className="mb-1">
                                    <span className="h4">{task.task_label}</span>{pill}
                                </div>
                                <pre className="mb-1">{task.task_description}</pre>
                            </div>
                            <div className="col-sm-1">
                                <div className="float-right">
                                    <button onClick={(e) => { this.updateModal(task); e.preventDefault(); return false; }} type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#exampleModal">
                                        Delete
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
                            <div className="col-sm-12">
                                <h5 className="mb-1">{task.task_label}</h5>
                                <pre className="mb-1">{task.task_description}</pre>
                            </div>
                        </div>
                    </div>
                )
            }
        })

        if (this.state.loading) {
            return (
                <div className="container mt-5">
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="container">
                    <div className="row my-5">
                        <div className="col-sm-3 border rounded">
                            <h2>Tags</h2>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <button type="button" className="btn btn-link" onClick={() => this.selectTag("")}>All</button>
                                    <span className="badge badge-primary badge-pill">{this.state.items.length}</span>
                                </li>
                                {tags}
                            </ul>
                        </div>
                        <div className="col-sm-9">
                            <div className="row">
                                <div className="col-sm-10">
                                    <h2>{title}</h2>
                                </div>
                                <div className="col-sm-2 mb-2 text-right">
                                    {addButton}
                                </div>
                            </div>
                            <div className="list-group">
                                {itemList}
                            </div>
                            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Warning</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            Are you sure you want to delete the task "<b>{this.state.task_to_delete?.task_label}</b>"?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                            <button onClick={(e) => { this.deleteTask(e); return true;  }} type="button" className="btn btn-outline-danger" data-dismiss="modal">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
TaskList.contextType = UserContext;

export default TaskList;