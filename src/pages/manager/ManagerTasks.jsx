import { useState, useEffect } from "react"

const ManagerTasks = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3000/manager/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await res.json()
      console.log("Team data:", result)
      if (result.success) {
        setData(result.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Manager Tasks</h1>
      {data.map((task) => (
  <div key={task._id}>
    <p>{task.title}</p>
    <p>{task.project?.name}</p>
    <p>{task.project?.projectKey}</p>
    <p>{task.assignedTo?.firstName} {task.assignedTo?.lastName}</p>
    <p>{task.status}</p>
    <p>{task.priority}</p>
  </div>
))}
    </div>
  )
}

export default ManagerTasks