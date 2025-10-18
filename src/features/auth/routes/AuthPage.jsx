import { useMemo, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuthActions } from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";

const squish = (v) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim() : v;
const normalizeEmail = (v) =>
  typeof v === "string" ? v.trim().toLowerCase().replace(/\s+/g, "") : v;

const FIRST_NAME = Yup.string().transform(squish).required().min(1).max(50);
const LAST_NAME = Yup.string().transform(squish).required().min(1).max(50);
const EMAIL = Yup.string()
  .transform(normalizeEmail)
  .required()
  .max(320)
  .email("Email is not a valid email");
const PASS_REQ = Yup.string().required().min(8).max(25);

function AuthPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login, signup } = useAuthActions();

  const [mode, setMode] = useState(
    loc.pathname.toLowerCase().includes("signup") ? "signup" : "login"
  );
  const isLogin = mode === "login";

  useEffect(() => {
    const want = loc.pathname.toLowerCase().includes("signup")
      ? "signup"
      : "login";
    if (want !== mode) setMode(want);
  }, [loc.pathname]);

  const switchMode = (next) => {
    setMode(next);
    nav(next === "login" ? "/login" : "/signup", { replace: true });
  };

  const LoginSchema = useMemo(
    () => Yup.object({ email: EMAIL, password: PASS_REQ }),
    []
  );
  const SignupSchema = useMemo(
    () =>
      Yup.object({
        first_name: FIRST_NAME,
        last_name: LAST_NAME,
        email: EMAIL,
        password: PASS_REQ,
      }),
    []
  );

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h1 className="text-2xl mb-1">{isLogin ? "Log in" : "Sign up"}</h1>
          <p className="text-sm text-mute mb-6">
            {isLogin
              ? "Welcome back. Enter your credentials to continue."
              : "Create an account to start writing and sharing notes."}
          </p>

          <Formik
            initialValues={
              isLogin
                ? { email: "", password: "" }
                : { first_name: "", last_name: "", email: "", password: "" }
            }
            validationSchema={isLogin ? LoginSchema : SignupSchema}
            enableReinitialize
            onSubmit={async (values, helpers) => {
              helpers.setStatus(null);
              try {
                if (isLogin) {
                  await login(values.email, values.password);
                } else {
                  await signup({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    password: values.password,
                  });
                }
                const dest = loc.state?.from?.pathname || "/feed";
                nav(dest, { replace: true });
              } catch (e) {
                const msg =
                  e?.details?.errors ||
                  e?.details?.error ||
                  e?.message ||
                  "Something went wrong";
                helpers.setStatus(msg);
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, status }) => (
              <Form className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="label" htmlFor="first_name">
                        First name
                      </label>
                      <Field
                        id="first_name"
                        name="first_name"
                        className="input"
                      />
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="label" htmlFor="last_name">
                        Last name
                      </label>
                      <Field
                        id="last_name"
                        name="last_name"
                        className="input"
                      />
                      <ErrorMessage
                        name="last_name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="input"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="input"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {status && (
                  <div className="text-red-500 text-sm whitespace-pre-line">
                    {Array.isArray(status) ? status.join("\n") : String(status)}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isLogin ? "Log in" : "Create account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-sm">
            <span className="mr-2">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}
            </span>
            <button
              type="button"
              className="text-brand underline"
              onClick={() => switchMode(isLogin ? "signup" : "login")}
            >
              {isLogin ? "Sign up here" : "Log in here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;