
import { Calendar, MapPin, Users } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

const SlugEventPage = async (props: Props) => {
  const { slug } = await props.params;
  if (slug.toUpperCase() !== "SCTI") redirect("/events/scti");


  return (
    <div className="flex flex-col mx-auto items-center justify-center gap-5 xl:gap-10 mt-10">
      <h1 className="text-6xl font-bold">{ slug.toUpperCase() }</h1>
      <div className="w-full flex justify-center items-center flex-col gap-2 xs:flex-row xs:gap-10 px-4 text-sm">
        <p className="flex items-center gap-2">
          <Calendar className="text-accent" size={16} /> 16-20 de Julho, 2025
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="text-accent" size={16} /> UENF
        </p>
        <p className="flex items-center gap-2">
          <Users className="text-accent" size={16} /> 1000 participantes
        </p>
      </div>
    </div>
  );
};

export default SlugEventPage;