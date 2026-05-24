export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="w-14 h-14 rounded-full border-4 border-border border-t-accent animate-spin" />
    </div>
  );
}