import React from "react";
import { toast, ToastOptions, TypeOptions } from "react-toastify";

export const useMessageToaster = () => {
  const style: ToastOptions<{}> = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const Error = (message: string) => {
    return toast.error(`${message}`, style);
  };
  const Success = (message: string) => {
    return toast.success(`${message}`, style);
  };
  const Promise = (
    messages: Array<string>,
    promise_fn: Promise<unknown> | (() => Promise<unknown>)
  ) => {
    return toast.promise(promise_fn, {
      pending: messages[0],
      success: messages[1],
      error: messages[2],
    });
  };
  const Loading = (message: string) => {
    return toast.loading(message);
  };
  const Update = (
    message: string,
    type: TypeOptions | null | undefined,
    tid: string
  ) => {
    return toast.update(tid, {
      render: message,
      type: type,
      autoClose: 5000,
      isLoading: false,
    });
  };
  return { Error, Success, Promise, Loading };
};
