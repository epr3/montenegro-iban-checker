import dayjs from "dayjs";
import { useMemo } from "react";

export default function ValidationItem({
  iban,
  status,
  timestamp,
}: {
  iban: string;
  status: string;
  timestamp: string;
}) {
  const computedIban = useMemo(() => {
    return (
      iban.substring(0, 2) +
      " " +
      iban.substring(2, 4) +
      " " +
      iban.substring(4, 7) +
      " " +
      iban.substring(7, 20) +
      " " +
      iban.substring(20, 22)
    );
  }, [iban]);

  return (
    <div className="flex justify-between gap-4 bg-white rounded-lg shadow px-4 py-2">
      <p>{computedIban}</p>
      <p className="font-bold">{status}</p>
      <p>{dayjs(timestamp).format("DD/MM/YYYY HH:mm")}</p>
    </div>
  );
}
