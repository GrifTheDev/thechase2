import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({cookies}) => {
  if (cookies.get("AccessToken") != undefined) throw redirect(303, "/app/dashboard")
}; 

// TODO: Add region suspicion thing
// TODO: LOADING ANIM
export const actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const email: string = data.get("email")?.toString() || "";
    const password: string = data.get("password")?.toString() || "";
    const confirmPswd: string = data.get("confirmPswd")?.toString() || "";
    const name: string = data.get("name")?.toString() || "";
    const surname: string = data.get("surname")?.toString() || "";

    if (email == "" || password == "")
      return { code: 400, message: "Please fill out both fields." };

    // E-mail does not contain @something.com
    if (email.split("@").length < 2)
      return { code: 400, message: "Invalid e-mail." };
    // The part after @ in the email does not contain a .
    if (email.split("@")[1].split(".").length < 2)
      return { code: 400, message: "Invalid e-mail." };

    if (confirmPswd != password) return {code: 400, message: "Passwords do not match."}

    const res = await fetch("/api/user/register", {
      method: "POST",
      body: JSON.stringify({ name: name, surname: surname, email: email, password: password })
    })

    const resContent = await res.json()

    if (resContent.code == 201) {
      throw redirect(303, "/app/dashboard")
    } else {
      return resContent
    }
  }
} satisfies Actions;
 