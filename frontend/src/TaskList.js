import React from 'react';
import { UserContext } from "./UserContext"
import { Link } from "react-router-dom";
import TaskListItem from './TaskListItem';

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

        const itemList = this.state.items.filter(task => task.task_description.includes(this.state.tag)).map(task =>
            <TaskListItem task={task} />
        )

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
                        </div>
                    </div>
                </div>
            );
        }
    }
}
TaskList.contextType = UserContext;

export default TaskList;