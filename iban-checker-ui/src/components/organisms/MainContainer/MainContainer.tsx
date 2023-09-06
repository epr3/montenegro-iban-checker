import { object, string } from "yup";
import { useFormik } from "formik";

import { useThrottle } from "@uidotdev/usehooks";

import Button from "../../atoms/Button/Button";
import Input from "../../molecules/Input/Input";

import { checkIban, verifyIban } from "../../../server/check-iban";

import { useEffect } from "react";
import { AxiosError } from "axios";

const schema = object().shape({
  iban: string().required().length(22).label("IBAN"),
  countryCode: string().required().length(2).label("Country code"),
  checkDigits: string().required().matches(/25/).label("Check digits"),
  bankCode: string().required().length(3).label("Bank code"),
  accountNumber: string().required().length(13).label("Account number"),
  nationalCheckDigits: string()
    .required()
    .length(2)
    .label("National check digits"),
});

export default function MainContainer() {
  const {
    isSubmitting,
    getFieldProps,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    values: { iban },
  } = useFormik({
    validationSchema: schema,
    initialValues: {
      iban: "",
      countryCode: "",
      checkDigits: "",
      bankCode: "",
      accountNumber: "",
      nationalCheckDigits: "",
    },
    onSubmit: async (values) => {
      const {
        countryCode,
        checkDigits,
        bankCode,
        accountNumber,
        nationalCheckDigits,
      } = values;

      const { data } = await checkIban({
        country_code: countryCode,
        bank_code: bankCode,
        checksum_digits: parseInt(checkDigits),
        account_number: accountNumber,
        national_check_digits: parseInt(nationalCheckDigits),
      });
      sessionStorage.setItem("montenegro-iban:session", data.data.session_id);
    },
  });

  const debouncedIban = useThrottle(iban, 3000);

  useEffect(() => {
    setFieldValue("countryCode", iban.length > 2 ? iban.substring(0, 2) : "");
    setFieldValue("checkDigits", iban.length >= 2 ? iban.substring(2, 4) : "");
    setFieldValue("bankCode", iban.length >= 4 ? iban.substring(4, 7) : "");
    setFieldValue(
      "accountNumber",
      iban.length >= 7 ? iban.substring(7, 20) : ""
    );
    setFieldValue(
      "nationalCheckDigits",
      iban.length >= 22 ? iban.substring(20, 22) : ""
    );
  }, [iban, setFieldValue]);

  useEffect(() => {
    async function check() {
      if (debouncedIban.length > 2) {
        try {
          const { data } = await verifyIban(debouncedIban);
          console.log(data);
        } catch (e) {
          console.log((e as AxiosError).response);
        }
      }
    }
    check();
  }, [debouncedIban]);

  return (
    <form
      onSubmit={handleSubmit}
      className="px-8 py-12 rounded-lg shadow-lg bg-white min-w-[600px] flex flex-col gap-4"
    >
      <h1 className="text-3xl font-extrabold">Montenegro IBAN checker</h1>

      <Input
        placeholder="ME25BBBAAAAAAAAAAAAANN"
        label="Enter your IBAN here"
        {...getFieldProps("iban")}
        isTouched={touched.iban}
        errors={errors.iban}
      />
      {touched.accountNumber && errors.accountNumber}
      <Button disabled={isSubmitting} type="submit">
        Check IBAN
      </Button>
    </form>
  );
}
