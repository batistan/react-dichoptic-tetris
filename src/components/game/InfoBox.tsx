export default function InfoBox({ label, value }: { label: string; value: number }) {
  return (<div className="m-3 flex flex-col max-w-20">
    <p className="font-mono text-gray-700">{label}</p>
    <div className="font-mono px-1 rounded-md bg-board text-right text-text">{value}</div>
  </div>)
}