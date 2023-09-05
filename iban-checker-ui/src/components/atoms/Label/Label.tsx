export default function Label({ id, text }: { id: string; text: string }) {
  return (
    <label className="font-semibold text-lg text-gray-800 pl-2" htmlFor={id}>
      {text}
    </label>
  );
}
