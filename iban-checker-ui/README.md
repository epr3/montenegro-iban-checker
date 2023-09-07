# Montenegro IBAN checker UI

This is the UI for the Montenegro IBAN checker. It validates the IBAN in real time before sending it to the backend. It also connects to the FastAPI application which validates the IBAN.

## Libraries used
* Formik
* Axios
* Yup

## Prerequisites
1. Node 18
2. pnpm

## Steps to install the project

1. Set up the env variables and modify the file according to your needs

``` cp .env.example .env.local ```

2. Install dependencies

``` pnpm install ```

3. Run project

``` pnpm run dev ```

4. Run tests

``` pnpm run test ```
