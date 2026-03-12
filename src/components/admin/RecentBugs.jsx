const RecentBugs = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Bugs</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="pb-2">Title</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2">Login Error</td>
            <td className="text-yellow-500">Pending</td>
            <td className="text-red-500">High</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecentBugs;