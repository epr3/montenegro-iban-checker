import { instance } from "./axios";

export async function checkIban(
  url: string,
  {
    arg,
  }: {
    arg: {
      country_code: string;
      bank_code: string;
      checksum_digits: number;
      account_number: string;
      national_check_digits: number;
    };
  }
) {
  await instance.post(url, {
    ...arg,
  });
}
