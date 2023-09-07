import { object, string } from "yup";
import { useFormik } from "formik";

import Button from "../../atoms/Button/Button";
import Alert from "../../atoms/Alert/Alert";
import Input from "../../molecules/Input/Input";

import { useContext, useEffect } from "react";

import { NotificationContext } from "../../../context/NotificationContext";

const schema = object().shape({
  iban: string().required().length(22).label("IBAN"),
  countryCode: string()
    .required()
    .length(2)
    .matches(/ME/, "Country code must be ME")
    .label("Country code"),
  checkDigits: string()
    .required()
    .matches(/25/, "Check digits must be 25")
    .label("Check digits"),
  bankCode: string().required().length(3).label("Bank code"),
  accountNumber: string().required().length(13).label("Account number"),
  nationalCheckDigits: string()
    .required()
    .length(2)
    .label("National check digits"),
});

interface MainContainerProps {
  submitFunc: ({
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
  }) => Promise<void>;
}

export default function MainContainer({ submitFunc }: MainContainerProps) {
  const { notifications } = useContext(NotificationContext);

  const {
    isSubmitting,
    getFieldProps,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    resetForm,
    isValid,
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

      await submitFunc({
        country_code: countryCode,
        bank_code: bankCode,
        checksum_digits: parseInt(checkDigits),
        account_number: accountNumber,
        national_check_digits: parseInt(nationalCheckDigits),
      });
      resetForm();
    },
  });

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

  return (
    <form
      onSubmit={handleSubmit}
      className="px-8 py-12 rounded-lg shadow-lg bg-white min-w-[600px] flex flex-col gap-4"
    >
      {notifications.length ? (
        <Alert
          type={notifications[0].type}
          message={notifications[0].message}
        />
      ) : null}
      <h1 className="text-3xl font-extrabold">Montenegro IBAN checker</h1>

      <Input
        placeholder="ME25BBBAAAAAAAAAAAAANN"
        label="Enter your IBAN here"
        {...getFieldProps("iban")}
        isTouched={touched.iban}
        errors={
          errors.countryCode ||
          errors.checkDigits ||
          errors.bankCode ||
          errors.accountNumber ||
          errors.nationalCheckDigits ||
          errors.iban
        }
      />
      {touched.accountNumber && errors.accountNumber}
      <Button disabled={!isValid || isSubmitting} type="submit">
        Check IBAN
      </Button>
    </form>
  );
}
