import { useState, useEffect } from "react"

const ManagerReports = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3000/manager/reports", {
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
    <h1>Manager Reports</h1>
    <p>Total Projects: {data?.totalProjects}</p>
    <p>Tasks by Status:</p>
    {data?.tasksByStatus?.map((item) => (
      <p key={item._id}>{item._id}: {item.count}</p>
    ))}
    <p>Bugs by Severity:</p>
    {data?.bugsBySeverity?.map((item) => (
      <p key={item._id}>{item._id}: {item.count}</p>
    ))}
  </div>
)
}

export default ManagerReports