import React from "react";
import { Link } from "react-router-dom";

export default function TaskListItem(props) {
    if (props.task.task_status === "open") {
        return (
            <Link key={props.task.task_id} to={{ pathname: "/edit", state: props.task }} className="list-group-item list-group-item-action">
                <div className="row">
                    <div className="col-sm-1">
                        <div className="float-left">
                            <button onClick={(e) => { props.completeTask(props.task); e.preventDefault(); return false; }} type="button" className="btn btn-outline-success">
                                Done
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-10">
                        <h5 className="mb-1">{props.task.task_label}</h5>
                        <pre className="mb-1">{props.task.task_description}</pre>
                    </div>
                    <div className="col-sm-1">
                        <div className="float-right">
                            <button onClick={(e) => { props.updateModal(props.task); e.preventDefault(); return false; }} type="button" className="btn btn-outline-danger" data-toggle="modal" data-target="#exampleModal">
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
            <div key={props.task.task_id} className="list-group-item list-group-item-action">
                <div className="row">
                    <div className="col-sm-12">
                        <h5 className="mb-1">{props.task.task_label}</h5>
                        <pre className="mb-1">{props.task.task_description}</pre>
                    </div>
                </div>
            </div>
        )
    }
}