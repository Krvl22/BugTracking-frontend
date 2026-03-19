import React, { useState } from "react";

const CreateBug = () => {

  const [bug, setBug] = useState({
    title: "",
    description: "",
    priority: "Low",
    assignedDeveloper: "",
    project: "",
    status:"open"
  });

  const handleChange = (e) => {
    setBug({
      ...bug,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Bug Created:", bug);

    // Later this will call API
    // POST /api/bugs
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">

      <h1 className="text-2xl font-bold mb-6">Create Bug</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg max-w-xl space-y-4"
      >

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={bug.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
            placeholder="Enter bug title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={bug.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
            placeholder="Describe the issue"
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={bug.priority}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Developer */}
        <div>
          <label className="block mb-1">Assign Developer</label>
          <select
            name="assignedDeveloper"
            value={bug.assignedDeveloper}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
            required
          >
            <option value="">Select Developer</option>
            <option value="John">John</option>
            <option value="Sarah">Sarah</option>
          </select>
        </div>

        {/* Project */}
        <div>
          <label className="block mb-1">Project</label>
          <select
            name="project"
            value={bug.project}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
            required
          >
            <option value="">Select Project</option>
            <option value="Bug Tracker">Bug Tracker</option>
            <option value="E-Auction">E-Auction</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Bug Status</label>
          <select
            name="status"
            value={bug.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
            required
          >
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="inProgress">In Progress</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Bug Type</label>
            <select
            name="bugType"
            value={bug.bugType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-700"
            >
              <option>Bug</option>
              <option>Task</option>
              <option>Improvement</option>
            </select>
        </div>

        <div>
          <label className="block mb-1">Created By</label>
          <input
          type="text"
          name="createdBy"
          value={bug.createdBy}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Bug
        </button>

      </form>
    </div>
  );
};

export default CreateBug;