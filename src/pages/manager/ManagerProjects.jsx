import { useState, useEffect } from "react";

const ManagerProjects=()=>{
    const[projects , setProjects] = useState([])
    const[loading , setLoading] = useState(true)


useEffect(()=>{
    const fetchProjects = async ()=>{
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/manager/projects",{
            headers:{Authorization:`Bearer ${token}`}
        })
        const data = await res.json()
        console.log("Projects Data:",data)
        if(data.success){
            setProjects(data.data.projects)
        }
        setLoading(false)
    }
    fetchProjects()
},[])

if(loading){
    return <p>Loading...</p>
}

return(
    <div>
            <h1 style={{color: "black"}}>TEST - Projects Page</h1>

        <h1>Manager Projects</h1>
        {projects.map((project)=>(
            <div key={project._id}>
                <p>{project.name}</p>
                <p>{project.status}</p>
                <p>Team Members: {project.teamMembers.length}</p>   
            </div>
        ))}
    </div>
)
}

export default ManagerProjects