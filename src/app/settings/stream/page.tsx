"use client";
import Input from "@/app/input";
import Button from "@/app/button";
import { useZodForm } from "@/app/useZodForm";
import useUserStore from "@/store/userStore";
import { z } from "zod";
import { useEffect } from "react";

export default function Stream() {
  const [nostrStore, setNostrValues] = useUserStore((state) => [
    state.nostr,
    state.setNostrValues,
  ]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useZodForm({
    mode: "onChange",
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      d: z.string().min(1),
      streaming: z.string().min(1),
      image: z.string(),
    }),
    defaultValues: {
      title: nostrStore.title,
      summary: nostrStore.summary,
      d: nostrStore.d,
      streaming: nostrStore.streaming,
      image: nostrStore.image,
    },
  });
  const onSubmit = (data: {
    title: any;
    summary: any;
    d: any;
    streaming: any;
    image: any;
  }) => {
    setNostrValues(data);
  };

  useEffect(() => {
    reset({
      title: nostrStore.title,
      summary: nostrStore.summary,
      d: nostrStore.d,
      streaming: nostrStore.streaming,
      image: nostrStore.image,
    });
  }, [
    nostrStore.title,
    nostrStore.summary,
    nostrStore.d,
    nostrStore.streaming,
    nostrStore.image,
  ]);

  return (
    <div className="px-6 py-6 h-full">
      <div className="flex flex-col gap-4 bg-stone-900 w-full lg:w-4/5 xl:w-2/3 2xl:w-1/2 rounded py-4 px-6">
        <form
          className="flex flex-col gap-y-4 overflow-y-auto"
          spellCheck={false}
        >
          <Input
            name="title"
            placeholder="stream title"
            register={register}
            formKey="title"
            error={errors.title}
          />

          <Input
            name="summary"
            placeholder="stream summary"
            register={register}
            formKey="summary"
            error={errors.summary}
          />

          <Input
            name="Identifier"
            placeholder="stream identifier"
            register={register}
            formKey="d"
            error={errors.d}
          />

          <Input
            name="Thumbnail"
            placeholder="thumnbnail url"
            register={register}
            formKey="image"
            error={errors.image}
          />

          <Input
            name="Stream URL"
            placeholder="stream url"
            register={register}
            formKey="streaming"
            error={errors.streaming}
          />
        </form>
        <div className="flex justify-end">
          <Button onClick={handleSubmit(onSubmit)}>Update</Button>
        </div>
      </div>
    </div>
  );
}
