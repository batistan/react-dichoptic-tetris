export default function InfoBox({ label, value }: { label: string; value: number }) {
  return (<dl className="text-text-dark m-3 max-w-20">
    <dt>{label}</dt>
    <dd className="px-1 rounded-md text-right bg-board-bg">{value}</dd>
  </dl>)
}