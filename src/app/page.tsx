import Image from "next/image";

import { Button } from "@/components/ui/button";
// import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function HomePage() {
  const imgs = ["img_0.png", "img_1.png", "img_2.png", "img_3.png", "img_4.png"];
  return (
    <div className="flex flex-col gap-4 items-center font-spartan mx-auto">
      <Carousel 
        className="relative w-full h-auto max-h-[80vh] xs:max-h-screen overflow-hidden"
        opts={{
          loop: true,
        }}
        plugins={[
          
        ]}
      >
        <div className="absolute bg-secondary/90 inset-0 z-10 flex items-center justify-center">
          <span className="text-primary">aaa</span>
        </div>
        <CarouselContent className="w-full h-full m-0 aspect-video">
          {imgs.map(name => 
            <CarouselItem className="relative w-full h-full p-0">
            <Image 
              key={name}
              src={`/img/home/${name}`}
              alt="Evento Imagem 3" 
              width={2000}
              height={2000}
              className="w-full h-full object-cover"
              priority
            />
          </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 z-20"/>
        <CarouselNext className="absolute right-2 z-20"/>
      </Carousel>
      {/* <div className="w-full flex justify-center items-center bg-secondary/90">
        <div className="w-3/4 flex flex-col items-center justify-around gap-2">
          <div className="text-center flex flex-col items-center font-medium max-h-96">
            <Image src={"/SCT.svg"} alt="Logo SCT" width={250} height={250} />
            <div className="mt-[-60px]">
              <p className="text-zinc-50">SEMANA DA</p>
              <p className="text-accent mt-[-8px] mb-1">CIÊNCIA & TECNOLOGIA</p>
            </div>
          </div>
          <h2 className="text-center text-xl font-medium text-zinc-50">
            Explore o futuro através da ciência e tecnologia. Participe de
            palestras, workshops e demonstrações que moldarão o amanhã.
          </h2>
          <div className="flex w-3/4 justify-around items-center">
            <Button asChild variant={"yellow"}>
              <Link href={"login"}>Login</Link>
            </Button>
          </div>
          <div className="w-full flex justify-around items-start my-3">
            <div className="w-1/2 flex items-end">
              <Calendar className="text-accent mr-1" />
              <p className="text-sm text-zinc-50">1-5 de Setembro de 2025</p>
            </div>
            <div className="w-1/2 flex items-end">
              <MapPin className="text-accent mr-1" />
              <p className="text-sm text-zinc-50">
                Universidade Estadual do Norte Fluminse - UENF
              </p>
            </div>
          </div>
        </div>
      </div> */}
      <h2 className="text-6xl font-bold">Eventos da Semana</h2>
      <h3 className="text-md text-center font-light max-w-[760px]">
        Descubra nossa programação completa com palestras, workshops e
        atividades práticas nas mais diversas áreas da ciência e tecnologia.
      </h3>
      <div className="w-3/4">
        {/* TODO: List activities */}
      </div>
      <h2 className="text-6xl font-bold">
        {" "}
        <span className="text-accent border-b-4 border-secondary">
          SCT
        </span>{" "}
        2025
      </h2>
      <div className="w-3/4 flex items-center justify-around flex-wrap md:w-full pb-6">
        <Image
          src={"/test.jpg"}
          width={250}
          height={200}
          alt=""
          className="rounded-md"
        />
        <div className="w-1/2 flex flex-col items-center justify-around">
          <h3 className="text-md font-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            mollis aliquet pellentesque. Nunc elementum, nulla et suscipit
            tincidunt, nisi ante pharetra eros, non tincidunt ante lorem eget
            lacus. Quisque consectetur dignissim nisi id bibendum. Aliquam
            auctor nisl a orci semper, ac sagittis ex iaculis. Nam condimentum
            justo ut molestie gravida. Aliquam metus lectus, dictum vehicula
            sodales sed, semper ac nisl. Donec id erat a est varius ultrices
            suscipit vel leo. Vivamus vitae congue elit. Pellentesque mollis,
            elit eget hendrerit efficitur, elit ipsum pretium risus, sit amet
            congue urna ligula non lorem. Donec et volutpat nisl, in egestas
            nibh. Cras ullamcorper, metus et lacinia tincidunt, arcu ex volutpat
            nulla, eu sodales justo velit at mi. Mauris sollicitudin nisi arcu,
            ac aliquam lacus sollicitudin venenatis.
          </h3>
          <Button asChild>
            <Link href={"login"}>Conheça nossa equipe</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
