import { PAGE_SIZE } from "../../../config";
import Button from "../../atoms/Button/Button";
import ValidationItem from "../../molecules/ValidationItem/ValidationItem";

export default function ValidationHistory({
  page,
  total,
  validations,
  loadMore,
}: {
  page: number;
  total: number;
  validations: {
    id: string;
    iban: string;
    status: string;
    timestamp: string;
  }[];
  loadMore: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-8 py-12 bg-white rounded-lg shadow-lg min-w-[600px]">
      <h3 className="text-xl font-medium">Validation history</h3>
      <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
        {validations.length ? (
          validations.map((item) => (
            <ValidationItem
              key={item.id}
              iban={item.iban}
              status={item.status}
              timestamp={item.timestamp}
            />
          ))
        ) : (
          <p>No validations yet.</p>
        )}
      </div>

      <Button disabled={page * PAGE_SIZE >= total} onClick={() => loadMore()}>
        Load more
      </Button>
    </div>
  );
}
