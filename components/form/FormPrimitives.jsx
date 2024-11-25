import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { createContext, forwardRef, useId } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import useFormField from "@/hooks/use-form-field";

// propagates useForm methods to all children components
export const FormContextProvider = FormProvider;

// contexts
export const FormFieldContext = createContext({});

export const Form = ({
  children,
  schema,
  defaultValues = null,
  onSubmit,
  ...props
}) => {
  const formMethods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormContextProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormContextProvider>
  );
};

export const FormField = ({
  controlledForm = false,
  children,
  className,
  ...props
}) => {
  const id = useId();

  return (
    <FormFieldContext.Provider value={{ id, name: props.name }}>
      <div className={className}>
        {controlledForm ? <Controller {...props} /> : <>{children}</>}
      </div>
    </FormFieldContext.Provider>
  );
};

// enables controlled forms
export const FormControl = forwardRef(({ ...props }, ref) => {
  const { error, formFieldId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formFieldId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});

export const FormLabel = forwardRef(
  ({ className, secondary = false, ...props }, ref) => {
    const { error, formFieldId } = useFormField();

    return (
      <Label
        ref={ref}
        className={cn(
          error && "text-destructive",
          secondary ? `text-sm ${!error ? "text-muted-foreground" : ""}` : "",
          className
        )}
        htmlFor={formFieldId}
        {...props}
      />
    );
  }
);

export const FormDescription = forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export const FormMessage = forwardRef(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    );
  }
);

// display names
FormControl.displayName = "FormControl";
FormLabel.displayName = "FormLabel";
FormDescription.displayName = "FormDescription";
FormMessage.displayName = "FormMessage";