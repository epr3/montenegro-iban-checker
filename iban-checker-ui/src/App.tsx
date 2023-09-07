import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import { PAGE_SIZE, SESSION_KEY } from "./config";

import { NotificationContext } from "./context/NotificationContext";

import MainContainer from "./components/organisms/MainContainer/MainContainer";
import ValidationHistory from "./components/organisms/ValidationHistory/ValidationHistory";
import AppTemplate from "./components/templates/AppTemplate/AppTemplate";

import { getValidations } from "./server/validations";
import { checkIban } from "./server/check-iban";

function App() {
  const [notifications, setNotifications] = useState<
    { type: "SUCCESS" | "ERROR"; message: string }[]
  >([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [validations, setValidations] = useState<
    {
      id: string;
      iban: string;
      status: string;
      timestamp: string;
      session_id: string;
    }[]
  >([]);

  useEffect(() => {
    async function loadData() {
      const { data } = await getValidations(page, PAGE_SIZE);
      setValidations((prevState) =>
        page > 1 ? [...prevState, ...data.data] : data.data
      );
      setTotal(data.meta.count);
    }
    loadData();
  }, [page]);

  const loadMore = () => {
    setPage((prevState) => prevState + 1);
  };

  const handleSubmit = async ({
    country_code,
    bank_code,
    checksum_digits,
    account_number,
    national_check_digits,
  }: {
    country_code: string;
    bank_code: string;
    checksum_digits: number;
    account_number: string;
    national_check_digits: number;
  }) => {
    try {
      const { data } = await checkIban({
        country_code,
        bank_code,
        checksum_digits,
        account_number,
        national_check_digits,
      });
      sessionStorage.setItem(SESSION_KEY, data.data.session_id);
      setValidations((prevState) => [...prevState, data.data]);
      setNotifications([{ type: "SUCCESS", message: data.message }]);
    } catch (e) {
      setNotifications([
        {
          type: "ERROR",
          message: (
            e as AxiosError<{
              message: string;
              data: {
                id: string;
                session_id: string;
                status: string;
                timestamp: string;
                iban: string;
              };
            }>
          ).response!.data.message,
        },
      ]);
      setValidations((prevState) => [
        ...prevState,
        {
          ...(
            e as AxiosError<{
              message: string;
              data: {
                id: string;
                session_id: string;
                status: string;
                timestamp: string;
                iban: string;
              };
            }>
          ).response!.data.data,
        },
      ]);
    }
  };

  return (
    <AppTemplate>
      <NotificationContext.Provider value={{ notifications, setNotifications }}>
        <MainContainer submitFunc={handleSubmit} />
        <ValidationHistory
          validations={validations}
          total={total}
          page={page}
          loadMore={loadMore}
        />
      </NotificationContext.Provider>
    </AppTemplate>
  );
}

export default App;
