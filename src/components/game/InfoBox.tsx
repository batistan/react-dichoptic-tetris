export default function InfoBox({ label, value }: { label: string; value: number }) {
  return (<div className="m-3 flex flex-col max-w-20">
    <p className="font-mono">{label}</p>
    <div className="font-mono px-1 rounded-md text-right">{value}</div>
  </div>)
}