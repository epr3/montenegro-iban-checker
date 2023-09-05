export default function Button({
  children,
  disabled = false,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      disabled={disabled}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:(bg-gray-300 text-gray-400)"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
