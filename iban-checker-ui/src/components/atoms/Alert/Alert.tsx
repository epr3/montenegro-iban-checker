export default function Alert({
  type,
  message,
}: {
  type: "SUCCESS" | "ERROR";
  message: string;
}) {
  return (
    <div
      className={`px-4 py-2 text-center ${
        type === "SUCCESS"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {message}
    </div>
  );
}
