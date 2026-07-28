export default function NumberStepper({ label, value, onChange, step = 0.5 }) {
  return (
    <div className="flex flex-col items-center">
      <label className="text-[10px] text-gray-500">{label}</label>
      <div className="flex items-center border rounded">
        <button
          type="button"
          onClick={() => onChange(parseFloat((value - step).toFixed(2)))}
          className="px-1.5 text-xs hover:bg-gray-100"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-12 text-center text-xs outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(parseFloat((value + step).toFixed(2)))}
          className="px-1.5 text-xs hover:bg-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
}