import { sidebarConfig } from "../config/sidebarConfig";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const menu = sidebarConfig[role] || [];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6 capitalize">{role} Panel</h2>

      <ul className="space-y-4">
        {menu.map((item, index) => (
          <li
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 cursor-pointer hover:text-sky-400"
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-5 h-5"
            />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;