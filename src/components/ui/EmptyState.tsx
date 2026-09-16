interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, message, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
      {icon && <div className="mb-4 text-gray-500">{icon}</div>}
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-400">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
