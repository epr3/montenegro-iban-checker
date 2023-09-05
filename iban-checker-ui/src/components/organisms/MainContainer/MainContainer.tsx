import { object, string } from "yup";
import { useFormik } from "formik";

import Button from "../../atoms/Button/Button";
import Input from "../../molecules/Input/Input";
import useSWRMutation from "swr/mutation";
import { checkIban } from "../../../services/check-iban";

const schema = object().shape({
  iban: string().required().label("IBAN"),
});

export default function MainContainer() {
  const { trigger } = useSWRMutation("/check-iban", checkIban);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      iban: "",
    },
    onSubmit: (values) => {
      const { iban } = values;
      const countryCode = iban.substring(0, 2);
      const checkDigits = parseInt(iban.substring(2, 4));
      const bankCode = iban.substring(4, 7);
      const accountNumber = iban.substring(7, iban.length - 2);
      const nationalCheckDigits = parseInt(
        iban.substring(iban.length - 2, iban.length)
      );

      trigger({
        country_code: countryCode,
        bank_code: bankCode,
        checksum_digits: checkDigits,
        account_number: accountNumber,
        national_check_digits: nationalCheckDigits,
      });
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="px-8 py-12 rounded-lg shadow-lg bg-white min-w-[500px] flex flex-col gap-4"
    >
      <h1 className="text-3xl font-extrabold">Montenegro IBAN checker</h1>

      <Input
        placeholder="ME25BBBAAAAAAAAAAAAANN"
        label="Enter your IBAN here"
        {...formik.getFieldProps("iban")}
        isTouched={formik.touched.iban}
        errors={formik.errors.iban}
      />

      <Button type="submit">Check IBAN</Button>
    </form>
  );
}
