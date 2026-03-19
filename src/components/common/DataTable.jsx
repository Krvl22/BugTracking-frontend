import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <table className="w-full text-left">

        <thead className="bg-slate-700 text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="p-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-t border-slate-700 hover:bg-slate-700/40"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="p-3">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default DataTable;