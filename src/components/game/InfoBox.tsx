export default function InfoBox({ label, value }: { label: string; value: number }) {
  return (<div className="text-text-dark m-3 flex flex-col max-w-20">
    <p className="">{label}</p>
    <div className="px-1 rounded-md text-right bg-board-bg">{value}</div>
  </div>)
}