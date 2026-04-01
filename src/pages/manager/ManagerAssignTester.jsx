import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerAssignTester = () => {
  const [tasks, setTasks] = useState([]);
  const [testers, setTesters] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ✅ FETCH TASKS (submitted → manager)
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/tasks/testing-queue",
        config
      );
      setTasks(res.data?.data || []); // 🔥 safe
    } catch (err) {
      console.log(err);
      setTasks([]); // fallback
    }
  };

  // ✅ FETCH TESTERS
  const fetchTesters = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/manager/team",
        config
      );

      const onlyTesters = (res.data?.data || []).filter(
        (user) => user.role === "tester"
      );

      setTesters(onlyTesters);
    } catch (err) {
      console.log(err);
      setTesters([]); // fallback
    }
  };

  // ✅ SAFE EFFECT (no warning)
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTasks(), fetchTesters()]);
    };

    loadData();
  }, []);

  // ✅ ASSIGN TESTER
  const handleAssign = async (taskId, testerId) => {
    if (!testerId) return;

    try {
      await axios.put(
        `http://localhost:3000/manager/assign-tester/${taskId}`,
        { testerId },
        config
      );

      alert("Tester assigned");

      fetchTasks(); // refresh
    } catch (err) {
      console.log(err);
      alert("Error assigning tester");
    }
  };

  return (
    <div className="p-4">
      <h1>Assign Tester</h1>

      {(!tasks || tasks.length === 0) && <p>No tasks pending</p>}

      {(tasks || []).map((task) => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <p>Project: {task.project?.name}</p>

          <select
            defaultValue=""
            onChange={(e) =>
              handleAssign(task._id, e.target.value)
            }
          >
            <option value="">Select Tester</option>

            {(testers || []).map((tester) => (
              <option key={tester._id} value={tester._id}>
                {tester.firstName} {tester.lastName}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default ManagerAssignTester;