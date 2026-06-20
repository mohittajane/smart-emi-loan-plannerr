type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

const StatCard = ({ title, value, subtitle }: Props) => {
  return (
    <div className="stat-card glass-panel">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {subtitle ? <div className="stat-subtitle">{subtitle}</div> : null}
    </div>
  );
};

export default StatCard;
