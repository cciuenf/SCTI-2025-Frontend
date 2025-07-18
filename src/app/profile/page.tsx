import VerifyForm from "@/components/VerifyForm";
import ProfileBar from "@/components/Profile/ProfileBar";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col gap-15 items-center mt-5">
      <ProfileBar />
      <div className="w-4/5 flex flex-col items-center justify-around gap-3">
        <h2 className="text-4xl">Nome da visualização no momento</h2>
        <p className="text-md">Descrição da view no momento</p>
        <h2 className="text-2xl">Área de conteúdo da view em questão</h2>
        <div className="w-full flex justify-between items-center">
          <div className="w-1/3">
            <h2 className="text-2xl">Informações sobre o usuário</h2>
          </div>
          <div className="w-1/3">
            <h2 className="text-2xl">Informações sobre a sessão atual</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
