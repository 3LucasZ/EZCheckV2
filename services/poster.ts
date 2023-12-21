import { errorToast, successToast } from "./toasty";

export async function poster(
  path: string,
  body: any,
  toaster?: any
): Promise<Response> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status != 200) {
      if (toaster) errorToast(toaster, "" + (await res.json()));
    } else {
      if (toaster) successToast(toaster, "Success!");
    }
    return res;
  } catch (error) {
    if (toaster) errorToast(toaster, "Unknown error: " + error);
    return new Response();
  }
}
