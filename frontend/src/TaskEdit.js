import React from 'react';
import { UserContext } from "./UserContext"
import { v4 as uuidv4 } from 'uuid';
import Navigation from './Navigation';
import { Redirect } from "react-router-dom";

class TaskEdit extends React.Component {

    constructor(props, context) {
        super(props, context);
        if (props.location.state) {
            this.title = "Edit task";
            this.state = props.location.state
        }
        else {
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

    render() {

        let buttons = (
            <div className="float-right">
                <button type="button" className="btn btn-outline-secondary mr-3" onClick={() => this.setState({ redirect: true })}>Cancel</button>
                <input type="submit" className="btn btn-primary" value="Save" />
            </div>
        )
        if (this.state.loading) {
            buttons = (
                <div className="float-right">
                    <button type="button" className="btn btn-outline-secondary mr-3" disabled>Cancel</button>
                    <button className="btn btn-primary" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">Saving...</span>
                    </button>
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
                </div>
            );
        }
    }
}

TaskEdit.contextType = UserContext;

export default TaskEdit;