{
  /* <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button> */
}

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { SCredentials } from "schemas";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { Header, Layout, StyledInput } from "components";
import Head from "next/head";
import classes from "./login.module.scss";
import { StyledButton } from "components";

const formikValidationSchema = toFormikValidationSchema(SCredentials);

type Credentials = {
  username: string;
  password: string;
};

function Login() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string>();
  const session = useSession();
  const callbackUrl = (router.query?.callbackUrl as string) ?? "/admin";

  useEffect(() => {
    if (session.data?.user) {
      router.push(callbackUrl);
    }
  }, [session.data?.user, callbackUrl, router]);

  async function handleSubmit({ username, password }: Credentials) {
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    if (res?.error) setError(res?.error);
    else router.reload();
    setSubmitting(false);
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    } as Credentials,
    validationSchema: formikValidationSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      handleSubmit(values);
    },
  });

  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta name='description' content='Login page' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Header title='Login' home='Gvatest' />
      <main className={classes.main}>
        <form onSubmit={formik.handleSubmit} className={classes.form}>
          <div className={classes.form_element}>
            <label htmlFor='username' className={classes.label}>
              Username
            </label>
            <StyledInput
              id='username'
              name='username'
              type='text'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            <div className={classes.error}>
              {formik.touched.username && formik.errors.username ? (
                <div>{formik.errors.username}</div>
              ) : null}
            </div>
          </div>
          <div className={classes.form_element}>
            <label htmlFor='password' className={classes.label}>
              Password
            </label>
            <StyledInput
              id='password'
              name='password'
              type='password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <div className={classes.error}>
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <StyledButton type='submit' disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </StyledButton>
          <div className={classes.error}>{error}</div>
        </form>
      </main>
    </Layout>
  );
}

export default Login;
