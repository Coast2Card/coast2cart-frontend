const StatCard = ({
  title,
  value,
  delta,
  note,
  accent = "primary",
  iconSrc,
}) => {
  const accentClasses = {
    primary: "border-l-12 border-primary",
    success: "border-l-12 border-success",
    warning: "border-l-12 border-warning",
  }[accent];

  return (
    <div
      className={`bg-base-300 rounded-2xl shadow-sm border ${accentClasses}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-primary">{title}</h3>
          {iconSrc && (
            <span className="w-9 h-9 rounded-lg bg-white grid place-items-center">
              <img src={iconSrc} alt="icon" className="w-5 h-5" />
            </span>
          )}
        </div>
        <div className="flex items-end gap-4 mt-4">
          <div className="text-5xl font-bold">{value}</div>
          <div className="badge badge-ghost text-base">{delta}</div>
        </div>
        {note && <p className="mt-3 text-sm text-base-content/70">{note}</p>}
      </div>
    </div>
  );
};

export default StatCard;
