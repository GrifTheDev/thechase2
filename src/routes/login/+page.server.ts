import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {
    if (cookies.get("AccessToken") != undefined) throw redirect(303, "/app/dashboard")
}; 

// TODO: Add region suspicion thing
export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const email: string = data.get("email")?.toString() || "";
    let password: string = data.get("password")?.toString() || "";

    if (email == "" || password == "")
      return { code: 400, message: "Please fill out both fields." };

    // E-mail does not contain @something.com
    if (email.split("@").length < 2)
      return { code: 400, message: "Invalid e-mail." };
    // The part after @ in the email does not contain a .
    if (email.split("@")[1].split(".").length < 2)
      return { code: 400, message: "Invalid e-mail." };

    const res = await fetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify({email: email, password: password})
    })

    const resContent = await res.json()

    if (resContent.code == 200) {
      throw redirect(303, "/app/dashboard")
    } else {
      return resContent
    }
  },
} satisfies Actions;

