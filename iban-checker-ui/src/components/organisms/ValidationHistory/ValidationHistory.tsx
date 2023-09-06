import { useEffect, useState } from "react";
import { getValidations } from "../../../server/validations";

import Button from "../../atoms/Button/Button";
import ValidationItem from "../../molecules/ValidationItem/ValidationItem";

const pageSize = 12;
export default function ValidationHistory() {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [validations, setValidations] = useState<
    {
      id: string;
      iban: string;
      status: string;
      timestamp: string;
    }[]
  >([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await getValidations(page, pageSize);
      setValidations(data.data);
      setTotal(data.meta.total);
    }
    loadData();
  }, [page]);

  const loadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  return (
    <div className="flex flex-col gap-4 px-8 py-12 bg-white rounded-lg shadow-lg min-w-[600px]">
      <h3 className="text-xl font-medium">Validation history</h3>
      <div className="flex flex-col gap-2">
        {validations.map((item) => (
          <ValidationItem
            key={item.id}
            iban={item.iban}
            status={item.status}
            timestamp={item.timestamp}
          />
        ))}
      </div>
      {page * pageSize <= total ? (
        <Button onClick={() => loadMore()}>Load more</Button>
      ) : null}
    </div>
  );
}
