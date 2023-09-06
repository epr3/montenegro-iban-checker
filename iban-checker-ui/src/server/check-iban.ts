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
  instance.post("/check-iban", {
    country_code,
    bank_code,
    checksum_digits,
    account_number,
    national_check_digits,
  });

export const verifyIban = (iban: string) => instance.get(`/check-iban/${iban}`);
