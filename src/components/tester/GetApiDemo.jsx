// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from 'react-toastify'


// export const GetApiDemo = () => {
//   const [users, setusers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getUsers = async () => {
//     try {
//       const res = await axios.get("https://node5.onrender.com/user/user/");
//       console.log(res);
//       setusers(res.data.data);
//     } catch (error) {
//       console.log("API ERROR:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getUsers();
//   }, []);

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>GET API DEMO</h1>

//       {loading ? (
//         <h3>Loading...</h3>
//       ) : (
//         <table border="1" cellPadding="10" style={{ margin: "auto" }}>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td>{user._id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };




import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const GetApiDemo = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET USERS
  const getUsers = async () => {
    try {
      const res = await axios.get("https://node5.onrender.com/user/user/");
      console.log("response...", res);
      setUsers(res.data.data);
    } catch (error) {
      console.log("API ERROR:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE USER
  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(
        `https://node5.onrender.com/user/user/${id}`
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("User deleted successfully");
        getUsers(); // refresh list
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  // ✅ USE EFFECT
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>GET API DEMO</h1>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ margin: "auto", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => deleteUser(user._id)}
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};