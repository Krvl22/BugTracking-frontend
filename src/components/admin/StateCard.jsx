const StateCard = ({ title, value, change }) => {
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");

  // Progress bar fill based on value type
  const progressColor = isNegative
    ? "from-red-500 to-orange-500"
    : isPositive
    ? "from-blue-500 to-cyan-400"
    : "from-green-500 to-emerald-400";

  const changeColor = isNegative
    ? "text-red-400"
    : isPositive
    ? "text-blue-400"
    : "text-green-400";

  return (
    <div className="bg-[#111936] border border-[#1e2a4a] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#2d3d6b] transition-all duration-200">
      <p className="text-[#6b7db3] text-sm font-medium">{title}</p>
      <p className="text-white text-4xl font-bold tracking-tight leading-none">{value}</p>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#1e2a4a] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${progressColor}`}
          style={{ width: "60%" }}
        />
      </div>

      {change && (
        <p className={`text-xs font-semibold ${changeColor}`}>{change} from last period</p>
      )}
    </div>
  );
};

export default StateCard;
