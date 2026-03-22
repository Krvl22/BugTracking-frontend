import { useState, useEffect } from "react"

const ManagerTeam = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:3000/manager/team", {
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
      <h1>Manager Team</h1>
      {data.map((member) => (
        <div key={member._id}>
          <p>{member.firstName} {member.lastName}</p>
          <p>{member.role}</p>
        </div>
      ))}
    </div>
  )
}

export default ManagerTeam