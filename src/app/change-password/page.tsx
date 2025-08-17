import ChangePasswordForm from "@/components/Auth/ChangePasswordForm";
import { redirect } from "next/navigation";

type Props = {
  searchParams?: { token?: string };
};

const ChangePasswordPage = ({ searchParams }: Props) => {
  const token = searchParams?.token ?? "";

  if (!token || token.length < 50) redirect("/");
  
  return (
    <div className="h-screen flex items-center justify-center">
      <ChangePasswordForm token={token} />
    </div>
  );
};

export default ChangePasswordPage;
