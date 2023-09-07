import { AxiosResponse } from "axios";
import { instance } from "../lib/axios";

export const checkIban = ({
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
}) =>
  instance.post<
    {
      country_code: string;
      bank_code: string;
      checksum_digits: number;
      account_number: string;
      national_check_digits: number;
    },
    AxiosResponse<
      {
        message: string;
        data: {
          id: string;
          session_id: string;
          status: string;
          timestamp: string;
          iban: string;
        };
      },
      { error: string; message: string }
    >
  >("/check-iban", {
    country_code,
    bank_code,
    checksum_digits,
    account_number,
    national_check_digits,
  });
