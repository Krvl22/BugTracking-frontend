import { useState, useEffect } from "react"

const ManagerBugs = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3000/manager/bugs", {
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
      <h1>Manager Bugs</h1>
      {data.map((bugs) => (
        <div key={bugs._id}>
          <p>{bugs.firstName} {bugs.lastName}</p>
          <p>{bugs.commentedBy}</p>
          <p>{bugs.task}</p>
          <p>{bugs.title}</p>
          <p>{bugs.issueKey}</p>
        </div>
      ))}
    </div>
  )
}

export default ManagerBugs