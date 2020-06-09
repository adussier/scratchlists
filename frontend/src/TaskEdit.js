import React from 'react';
import { UserContext } from "./UserContext"
import { v4 as uuidv4 } from 'uuid';
import Navigation from './Navigation';
import { Redirect } from "react-router-dom";

class TaskEdit extends React.Component {

    constructor(props, context) {
        super(props, context);
        if (props.location.state) {
            this.edit = true;
            this.title = "Edit task";
            this.state = props.location.state
        }
        else {
            this.edit = false;
            this.title = "Add task";
            let user = context
            this.state = {
                username: user.username,
                task_id: uuidv4(),
                task_label: "",
                task_description: "",
                task_status: "open",
                due_date: ""
            };
        }
        this.state.redirect = false;
        this.state.loading = false;
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        this.addTask();
        event.preventDefault();
    }

    addTask() {
        this.setState({ loading: true })
        let user = this.context;
        let task = this.state;
        delete task.loading;
        delete task.redirect;
        fetch("https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
                "X-Cognito-Token": user.id_token,
            }),
            body: JSON.stringify(task)
        })
        .then(() => {
            this.setState({ redirect: true })
        })
        .catch((err) => console.error(err));
    }

    deleteTask = () => {
        let user = this.context;
        let state = this.state;
        state.loading = true;
        this.setState(state);
        fetch("https://fjt42edot8.execute-api.eu-central-1.amazonaws.com/default/scratchlists?username=" + user.username + "&task_id=" + state.task_id, {
            method: "DELETE",
            headers: new Headers({
                "X-Cognito-Token": user.id_token,
            })
        })
        .then(() => this.setState({ redirect: true }))
        .catch((err) => console.error(err));
    }

    render() {

        let cancelButton = <button type="button" className="btn btn-outline-secondary ml-2" onClick={() => this.setState({ redirect: true })}>Cancel</button>;
        let deleteButton = (
            <button type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#exampleModal">
                Delete
            </button>
        )
        let saveButton = <input type="submit" className="btn btn-primary ml-2" value="Save" />

        if (this.state.loading) {
            cancelButton = <button type="button" className="btn btn-outline-secondary ml-2" onClick={() => this.setState({ redirect: true })} disabled>Cancel</button>;
            deleteButton = (
                <button type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#exampleModal" disabled>
                    Delete
                </button>
            )
            saveButton = (
                <button className="btn btn-primary ml-2" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="sr-only">Saving...</span>
                </button>
            )
        }

        let buttons = (
            <div className="float-right">
                {cancelButton}
                {saveButton}
            </div>
        )
        if (this.edit) {
            buttons = (
                <div className="float-right">
                    {deleteButton}
                    {cancelButton}
                    {saveButton}
                </div>
            )
        }

        if (this.state.redirect) {
            return <Redirect to="/open" />
        }
        else {
            return (
                <div>
                    <Navigation />
                    <div className="container">
                        <div className="my-5">
                            <h2>{this.title}</h2>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group row">
                                <label htmlFor="task_label" className="col-sm-2 col-form-label">Label</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="task_label" name="task_label" value={this.state.task_label} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="task_description" className="col-sm-2 col-form-label">Description</label>
                                <div className="col-sm-10">
                                    <textarea className="form-control" id="task_description" name="task_description" rows="3" value={this.state.task_description} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="due_date" className="col-sm-2 col-form-label">Due date</label>
                                <div className="col-sm-10">
                                    <input type="datetime-local" className="form-control" id="due_date" name="due_date" value={this.state.due_date} onChange={this.handleChange} />
                                </div>
                            </div>
                            {buttons}
                        </form>
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
            );
        }
    }
}

TaskEdit.contextType = UserContext;

export default TaskEdit;