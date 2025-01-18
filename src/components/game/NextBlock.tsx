export default function NextBlock({block, color}: {block: string, color: string}) {
  return <div className="p-3 flex-col justify-center">
    <p className="text-center uppercase text-gray-700">Next</p>
    <div className="bg-gray-500 rounded-md p-2">
      <p>{block}</p>
    </div>
  </div>
}