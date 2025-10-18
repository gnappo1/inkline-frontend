import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/components/AuthProvider";
import { useAuthActions } from "../../auth/hooks/useAuth";
import { api } from "../../../shared/lib/api";
import { Users, StickyNote, Lock, LockOpen } from "lucide-react";
import { useToast } from "../../../shared/notifications/ToastProvider";
import { Link } from "react-router";

const squish = (v) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim() : v);
const normalizeEmail = (v) =>
    typeof v === "string" ? v.trim().toLowerCase().replace(/\s+/g, "") : v;

const FIRST_NAME = Yup.string().transform(squish).required("Required").min(1).max(50);
const LAST_NAME = Yup.string().transform(squish).required("Required").min(1).max(50);
const EMAIL = Yup.string().transform(normalizeEmail).required("Required").max(320).email("Invalid email");
const PASS_ONLY = Yup.string().min(8, "Min 8").max(25, "Max 25");

const BaseSchema = Yup.object({
    first_name: FIRST_NAME,
    last_name: LAST_NAME,
    email: EMAIL,
    current_password: Yup.string().required("Current password is required"),
    change_password: Yup.boolean().default(false),
    new_password: Yup.mixed().strip(),
    new_password_confirmation: Yup.mixed().strip(),
});

const WithPasswordSchema = BaseSchema.shape({
    new_password: PASS_ONLY.required("New password is required"),
    new_password_confirmation: Yup.string()
        .oneOf([Yup.ref("new_password")], "Passwords must match")
        .required("Please confirm the new password"),
});

const DynamicSchema = Yup.lazy((values) =>
    values?.change_password ? WithPasswordSchema : BaseSchema
);

function Profile() {
    const { data: me } = useAuth() || {};
    const { updateProfile } = useAuthActions();
    const { push } = useToast() || { push: () => { } };

    const summaryQ = useQuery({
        queryKey: ["profile-summary"],
        queryFn: () => api.profileSummary(),
    });

    const initialValues = {
        first_name: me?.data?.attributes?.first_name ?? "",
        last_name: me?.data?.attributes?.last_name ?? "",
        email: me?.data?.attributes?.email ?? "",
        current_password: "",
        change_password: false,
        new_password: "",
        new_password_confirmation: "",
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
                <p className="text-mute mt-1">Manage your account and security.</p>
            </header>

            <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-card p-4">
                    <StickyNote className="h-5 w-5 opacity-80" />
                    <div>
                        <div className="text-sm opacity-75">Notes</div>
                        <Link to="/notes"><div className="text-xl font-semibold">{summaryQ.data?.notes_count ?? "—"}</div></Link>
                    </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-card p-4">
                    <Users className="h-5 w-5 opacity-80" />
                    <div>
                        <div className="text-sm opacity-75">Friends</div>
                        <Link to="/friends"><div className="text-xl font-semibold">{summaryQ.data?.friends_count ?? "—"}</div></Link>
                    </div>
                </div>
            </div>

            <div className="card p-4">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validateOnMount
                    validateOnChange
                    validateOnBlur
                    validationSchema={DynamicSchema}
                    onSubmit={async (values, helpers) => {
                        helpers.setStatus(null);
                        try {
                            const payload = {
                                first_name: values.first_name,
                                last_name: values.last_name,
                                email: values.email,
                                current_password: values.current_password,
                                ...(values.change_password
                                    ? {
                                        password: values.new_password,
                                        password_confirmation: values.new_password_confirmation,
                                    }
                                    : {}),
                            };

                            await updateProfile(payload);

                            helpers.resetForm({
                                values: {
                                    ...values,
                                    current_password: "",
                                    change_password: false,
                                    new_password: "",
                                    new_password_confirmation: "",
                                },
                            });
                            push("Profile updated", { variant: "success" });
                        } catch (e) {
                            const msg = e?.details?.errors || e?.details?.error || e?.message || "Something went wrong";
                            helpers.setStatus(msg);
                            push(msg, { variant: "error" });
                        } finally {
                            helpers.setSubmitting(false);
                        }
                    }}
                >
                    {({
                        values,
                        setFieldValue,
                        setFieldError,
                        setFieldTouched,
                        validateForm,
                        isSubmitting,
                        status,
                        dirty,
                        isValid,
                    }) => {
                        const canSave = Boolean(values.current_password && isValid && dirty && !isSubmitting);

                        return (
                            <Form className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="label" htmlFor="first_name">First name</label>
                                        <Field id="first_name" name="first_name" className="input w-full" />
                                        <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <label className="label" htmlFor="last_name">Last name</label>
                                        <Field id="last_name" name="last_name" className="input w-full" />
                                        <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className="label" htmlFor="email">Email</label>
                                    <Field id="email" name="email" type="email" className="input w-full" />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="pt-2">
                                    <label className="label" htmlFor="current_password">Current password</label>
                                    <Field id="current_password" name="current_password" type="password" className="input w-full" />
                                    <ErrorMessage name="current_password" component="div" className="text-red-500 text-sm mt-1" />
                                    <p className="text-xs text-mute mt-1">Required to save any changes.</p>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const next = !values.change_password;
                                            setFieldValue("change_password", next);
                                            if (!next) {
                                                setFieldValue("new_password", "");
                                                setFieldValue("new_password_confirmation", "");
                                                setFieldError("new_password", undefined);
                                                setFieldError("new_password_confirmation", undefined);
                                                setFieldTouched("new_password", false, false);
                                                setFieldTouched("new_password_confirmation", false, false);
                                            }
                                            await validateForm();
                                        }}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition
                      ${values.change_password ? "text-[hsl(var(--brand))] border-[hsl(var(--brand)/.4)]" : "border-black/10 dark:border-white/10"}`}
                                        aria-pressed={values.change_password}
                                    >
                                        {values.change_password ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                        {values.change_password ? "Cancel password change" : "Change password"}
                                    </button>
                                </div>

                                {values.change_password && (
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="label" htmlFor="new_password">New password</label>
                                            <Field id="new_password" name="new_password" type="password" className="input w-full" />
                                            <ErrorMessage name="new_password" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                        <div>
                                            <label className="label" htmlFor="new_password_confirmation">Confirm new password</label>
                                            <Field id="new_password_confirmation" name="new_password_confirmation" type="password" className="input w-full" />
                                            <ErrorMessage name="new_password_confirmation" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>
                                )}

                                {status && (
                                    <div className="text-red-500 text-sm whitespace-pre-line">
                                        {Array.isArray(status) ? status.join("\n") : String(status)}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button type="submit" className="btn btn-primary w-full" disabled={!canSave}>
                                        {isSubmitting ? "Saving…" : "Save changes"}
                                    </button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}

export default Profile;