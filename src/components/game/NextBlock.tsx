export default function NextBlock({block, color}: {block: string, color: string}) {
  return <div>
    <p>Next</p>
    <div>
      <p>{block}</p>
    </div>
  </div>
}