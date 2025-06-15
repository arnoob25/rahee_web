"use client";

import { useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Baby, User } from "lucide-react";
import { reservationsStore } from "../reservations";

const nameValidation = z
  .string()
  .min(3, "Please provide the guest's full name.")
  .regex(/^\s*\S+(?:\s+\S+)+\s*$/, "Separate fist and last names by a space.");

const bdPhoneValidation = z
  .string()
  .regex(/^01[0-9]{9}$/, "Enter a valid Bangladeshi number");

const schema = z.object({
  adults: z
    .array(
      z.object({
        id: z.string(),
        fullName: nameValidation,
        phone: bdPhoneValidation,
      })
    )
    .min(1),
  children: z.array(
    z.object({
      id: z.string(),
      fullName: nameValidation,
      guardianId: z
        .string()
        .min(1, "Please pick a legal guardian for the child."),
    })
  ),
});

export default function GuestDetailsForm({ reservation }) {
  const { id, adults = [], children = [] } = reservation;
  const { updateReservationData } = reservationsStore();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: getFormDefaultValues(adults, children),
  });

  const onSubmit = (data) => {
    updateReservationData(id, {
      adults: data.adults,
      children: data.children,
    });
    toast.success("Reservation details saved");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-border rounded-xl space-y-9 p-5 py-8"
    >
      <div className="space-y-6">
        {adults.map((adult, i) => (
          <AdultFields
            key={adult.id}
            index={i}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        ))}
      </div>

      {children.length > 0 && (
        <>
          <Separator />
          <div className="space-y-6">
            {children.map((child, i) => (
              <ChildFields
                key={child.id}
                index={i}
                control={control}
                setValue={setValue}
                errors={errors}
              />
            ))}
          </div>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        onClick={() => {
          if (Object.keys(errors).length > 0)
            toast.error("Please fill in the form.");
        }}
      >
        Save Details
      </Button>
    </form>
  );
}

function AdultFields({ index, control, setValue, errors }) {
  return (
    <div className="space-y-1.5">
      <span className="flex items-center gap-1.5">
        <User />
        <h3 className="font-medium text-lg">Adult {index + 1}</h3>
      </span>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name={`adults.${index}.fullName`}
          render={({ field }) => (
            <div className="flex flex-col space-y-1">
              <Input
                {...field}
                onChange={(e) =>
                  setValue(`adults.${index}.fullName`, e.target.value)
                }
                placeholder="Full Name"
                className="bg-background"
              />
              {errors.adults?.[index]?.fullName && (
                <p className="pl-0.5 text-xs text-destructive">
                  {errors.adults[index].fullName.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name={`adults.${index}.phone`}
          render={({ field }) => (
            <div className="flex flex-col space-y-1">
              <Input
                {...field}
                onChange={(e) =>
                  setValue(`adults.${index}.phone`, e.target.value)
                }
                placeholder="Phone Number"
                className="bg-background"
              />
              {errors.adults?.[index]?.phone && (
                <p className="pl-0.5 text-xs text-destructive">
                  {errors.adults[index].phone.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}

function ChildFields({ index, control, setValue, errors }) {
  const watchedAdults = useWatch({ control, name: "adults" });

  const allAdultsFilled = useMemo(
    () => watchedAdults.every((a) => a.fullName && a.phone),
    [watchedAdults]
  );

  return (
    <div className="space-y-1.5">
      <span className="flex items-center gap-1.5">
        <Baby />
        <h3 className="font-medium text-lg">Child {index + 1}</h3>
      </span>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name={`children.${index}.fullName`}
          render={({ field }) => (
            <div className="flex flex-col space-y-1">
              <Input
                {...field}
                onChange={(e) =>
                  setValue(`children.${index}.fullName`, e.target.value)
                }
                placeholder="Full Name"
                className="bg-background"
              />
              {errors.children?.[index]?.fullName && (
                <p className="pl-0.5 text-xs text-destructive">
                  {errors.children[index].fullName.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name={`children.${index}.guardianId`}
          render={({ field }) => (
            <div className="flex flex-col space-y-1">
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (!allAdultsFilled) {
                    toast.error("Fill all adult details first");
                    return;
                  }
                  field.onChange(value);
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select Guardian" />
                </SelectTrigger>
                <SelectContent>
                  {watchedAdults.map((a, j) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.fullName || `Adult ${j + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.children?.[index]?.guardianId && (
                <p className="pl-0.5 text-xs text-destructive">
                  {errors.children[index].guardianId.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}

function getFormDefaultValues(adults, children) {
  return {
    adults: adults.map((a) => ({
      id: a.id,
      fullName:
        a.firstName && a.lastName ? `${a.firstName} ${a.lastName}`.trim() : "",
      phone: a.phone ?? "",
    })),
    children: children.map((c) => ({
      id: c.id,
      fullName:
        c.firstName && c.lastName ? `${c.firstName} ${c.lastName}`.trim() : "",
      guardianId: c.guardianId ?? "",
    })),
  };
}
