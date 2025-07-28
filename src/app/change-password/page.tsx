import ChangePasswordForm from "@/components/Auth/ChangePasswordForm";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { token: string };
};

const page = async ({ searchParams }: Props) => {
  const params = await searchParams;

  if (params.token == "" || !params.token || params.token.length < 50) {
    redirect("/")
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <ChangePasswordForm token={params.token} />
    </div>
  );
};

export default page;
