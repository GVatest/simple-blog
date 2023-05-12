import React, { useState } from "react";
import { Dropzone, StyledButton, StyledInput } from "components";
import { useFormik } from "formik";
import { IPost } from "models";
import { SPost } from "schemas";
import { toFormikValidationSchema } from "zod-formik-adapter";
import classes from "./post-form.module.scss";

export type PostFormValues = Pick<IPost, "title" | "description"> & {
  file?: globalThis.File;
};

type PostFormProps = {
  oldPost?: IPost;
  handleSubmit: (newPost: PostFormValues, oldPost?: IPost) => Promise<void>;
  redirect?: () => void;
};

const formikValidationSchema = toFormikValidationSchema(SPost);

function PostForm({ oldPost, handleSubmit, redirect }: PostFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<globalThis.File>();
  const [error, setError] = useState<string>();
  const formik = useFormik({
    initialValues: {
      title: oldPost ? oldPost.title : "",
      description: oldPost ? oldPost.description : "",
    } as Omit<PostFormValues, "file">,
    validationSchema: formikValidationSchema,
    onSubmit: (values) => {
      setSubmitting(true);
      handleSubmit({ ...values, file: file }, oldPost)
        .then((res) => {
          if (redirect) {
            redirect();
          }
          return res;
        })
        .catch((e) => setError((e as Error).message))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={classes.form}>
      {Object.entries(formik.values).map(([key, value]) => (
        <div className={classes.form_element} key={key}>
          <label htmlFor={key} className={classes.label}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <StyledInput
            id={key}
            name={key}
            type='text'
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className={classes.error}>
            {formik.touched[key as keyof typeof formik.values] &&
            formik.errors[key as keyof typeof formik.values] ? (
              <div>{formik.errors[key as keyof typeof formik.values]}</div>
            ) : null}
          </div>
        </div>
      ))}
      <Dropzone setNewFile={setFile} />
      <StyledButton type='submit' disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </StyledButton>
      <div className={classes.error}>{error}</div>
    </form>
  );
}

export default PostForm;
