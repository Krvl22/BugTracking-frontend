import React, { useState } from "react";
import PageContainer from "../../components/common/PageContainer";

const EditBug = () => {

  const [bug, setBug] = useState({
    title: "",
    description: "",
    priority: "Low",
    assignedDeveloper: "",
    project: "",
    status: "open"
  });

  const handleChange = (e) => {
    setBug({
      ...bug,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Bug:", bug);
  };

  return (
    <PageContainer title="Edit Bug">

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">

        <input
          type="text"
          name="title"
          placeholder="Bug Title"
          value={bug.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={bug.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
          required
        />

        <select
          name="priority"
          value={bug.priority}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select
          name="assignedDeveloper"
          value={bug.assignedDeveloper}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
        >
          <option value="">Select Developer</option>
          <option>John</option>
          <option>Sarah</option>
        </select>

        <select
          name="project"
          value={bug.project}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
        >
          <option value="">Select Project</option>
          <option>Bug Tracker</option>
          <option>E-Auction</option>
        </select>

        <select
          name="status"
          value={bug.status}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
        >
          <option value="open">Open</option>
          <option value="assigned">Assigned</option>
          <option value="inProgress">In Progress</option>
          <option value="testing">Testing</option>
          <option value="done">Done</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Bug
        </button>

      </form>

    </PageContainer>
  );
};

export default EditBug;