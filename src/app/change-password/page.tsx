import ChangePasswordForm from "@/components/Auth/ChangePasswordForm";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ChangePasswordPage = async ({searchParams}: Props) => {
  const token = (await searchParams).token as string || "";
  if (!token || token.length < 50) redirect("/");
  
  return (
    <div className="h-screen flex items-center justify-center">
      <ChangePasswordForm token={token} />
    </div>
  );
};

export default ChangePasswordPage;