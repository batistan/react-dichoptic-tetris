export default function InfoBox({ label, value }: { label: string; value: number }) {
  return (<div>
    <p>{label}</p>
    <div>{value}</div>
  </div>)
}