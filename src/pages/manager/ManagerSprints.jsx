import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerSprint = () => {
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sprints, setSprints] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // ✅ FETCH SPRINTS
  const fetchSprints = async (projectId) => {
    try {
      const res = await axios.get(`/api/sprint?projectId=${projectId}`);
      setSprints(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FETCH TASKS
  const fetchTasks = async (projectId) => {
    try {
      const res = await axios.get(`/api/tasks?projectId=${projectId}`);
      setTasks(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ LOAD DATA
  useEffect(() => {
    if (!project) return;

    const loadData = async () => {
      await fetchSprints(project);
      await fetchTasks(project);
    };

    loadData();
  }, [project]);

  // ✅ SELECT TASK
  const handleSelectTask = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  // ✅ CREATE SPRINT
  const handleCreateSprint = async () => {
    try {
      await axios.post("/api/sprint", {
        name,
        project,
        startDate,
        endDate,
        tasks: selectedTasks,
      });

      alert("Sprint Created");

      // 🔥 refresh data
      fetchSprints(project);

      // 🔥 reset form
      setName("");
      setStartDate("");
      setEndDate("");

      // 🔥 RESET SELECTED TASKS (THIS IS THE CORRECT PLACE)
      setSelectedTasks([]);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4">
      <h1>Manager Sprint</h1>

      {/* CREATE SPRINT */}
      <div>
        <h2>Create Sprint</h2>

        <input
          type="text"
          placeholder="Sprint Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Project ID"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />

        {/* TASK SELECTION */}
        <div>
          <h3>Select Tasks</h3>

          {tasks.length === 0 && <p>No tasks available</p>}

          {tasks.map((task) => (
            <div key={task._id}>
              <input
                type="checkbox"
                checked={selectedTasks.includes(task._id)}
                onChange={() => handleSelectTask(task._id)}
              />
              <label>{task.title}</label>
            </div>
          ))}
        </div>

        <button onClick={handleCreateSprint}>
          Create Sprint
        </button>
      </div>

      {/* SPRINT LIST */}
      <div>
        <h2>All Sprints</h2>

        {sprints.length === 0 && <p>No sprints found</p>}

        {sprints.map((sprint) => (
          <div key={sprint._id}>
            <h3>{sprint.name}</h3>
            <p>Start: {sprint.startDate?.slice(0, 10)}</p>
            <p>End: {sprint.endDate?.slice(0, 10)}</p>
            <p>Status: {sprint.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerSprint;