import React from "react";
import PageContainer from "../common/PageContainer";

const activities = [
  {
    id: 1,
    action: "Bug Created",
    user: "John Doe",
    bug: "Login Error",
    date: "2026-03-12"
  },
  {
    id: 2,
    action: "Bug Assigned",
    user: "Manager",
    bug: "Task Update Error",
    date: "2026-03-13"
  },
  {
    id: 3,
    action: "Bug Closed",
    user: "Sarah",
    bug: "CV Ranking Bug",
    date: "2026-03-14"
  }
];

const ActivityLog = () => {
  return (
    <PageContainer title="Activity Log">

      <table className="w-full text-left">

        <thead className="bg-slate-700">
          <tr>
            <th className="p-3">Action</th>
            <th className="p-3">User</th>
            <th className="p-3">Bug</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((a) => (
            <tr key={a.id} className="border-t border-slate-700">
              <td className="p-3">{a.action}</td>
              <td className="p-3">{a.user}</td>
              <td className="p-3">{a.bug}</td>
              <td className="p-3">{a.date}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </PageContainer>
  );
};

export default ActivityLog;