import { useEffect } from "react";
import { useZodForm } from "./useZodForm";
import { z } from "zod";
import useObsStore from "@/store/obsStore";
import useObs from "./useObs";
import { OBSWebSocketError } from "obs-websocket-js";

export default function ConnectObs({ close }: { close: () => void }) {
  const obs = useObsStore();
  // const connect = useObs();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useZodForm({
    mode: "onChange",
    schema: z.object({
      ip: z.string().min(1),
      port: z.string().min(1),
      // password: z.string().optional(),
      password: z.string(),
    }),
  });

  useEffect(() => {
    reset({
      ip: obs.settings.ip,
      port: obs.settings.port,
      password: obs.settings.password,
    });
  }, []);

  const onSubmit = async (data: {
    ip: string;
    port: string;
    password: string;
  }) => {
    obs.setObsSettingsState(data.ip, data.port, data.password);
  };

  return (
    <div className="flex flex-col py-2 px-4 gap-2">
      <form spellCheck={false} onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <p>
            State:{" "}
            {obs.error
              ? obs.error
              : obs.connected
              ? "Connected"
              : "Not connected"}
          </p>
          <div className="flex flex-col">
            <label>IP Address</label>
            <input
              className={`
            ${errors.ip && "focus:border-red-500"}
            focus:shadow-outline h-8 w-full resize-none appearance-none rounded border border-gray-500 bg-gray-600 py-2 px-3 leading-tight text-white shadow placeholder:italic focus:border-primary focus:bg-slate-900 focus:outline-none
          `}
              type="text"
              placeholder="IP Address"
              autoComplete="off"
              {...register("ip")}
            />
            <p className="text-sm">{errors.ip?.message || <br />}</p>
          </div>

          <div className="flex flex-col">
            <label>Port</label>
            <input
              className={`
            ${errors.port && "focus:border-red-500"}
            focus:shadow-outline h-8 w-full resize-none appearance-none rounded border border-gray-500 bg-gray-600 py-2 px-3 leading-tight text-white shadow placeholder:italic focus:border-primary focus:bg-slate-900 focus:outline-none
          `}
              type="text"
              placeholder="Port"
              autoComplete="off"
              {...register("port")}
            />
            <p className="text-sm">{errors.port?.message || <br />}</p>
          </div>

          <div className="flex flex-col">
            <label>Password (Optional)</label>
            <input
              className={`
            ${errors.password && "focus:border-red-500"}
            focus:shadow-outline h-8 w-full resize-none appearance-none rounded border border-gray-500 bg-gray-600 py-2 px-3 leading-tight text-white shadow placeholder:italic focus:border-primary focus:bg-slate-900 focus:outline-none
          `}
              type="text"
              placeholder="Password"
              autoComplete="off"
              {...register("password")}
            />
            <p className="text-sm">{errors.password?.message || <br />}</p>
          </div>
        </div>
      </form>
      <button
        className="px-2 py-1 rounded font-semibold bg-red-500 disabled:bg-gray-500"
        disabled={!isValid}
        onClick={handleSubmit(onSubmit)}
      >
        Update
      </button>
    </div>
  );
}
