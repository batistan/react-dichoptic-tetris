export default function InfoBox({ label, value }: { label: string; value: number }) {
  return (<div className="flex-col gap-2 mx-3">
    <p className="font-mono text-gray-700">{label}</p>
    <div className="font-mono rounded-md bg-gray-700 text-right text-gray-300">{value}</div>
  </div>)
}