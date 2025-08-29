"use client";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "../ui/carousel";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Fade from "embla-carousel-fade";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  hasLogin?: boolean;
};

const InfoCarousel = ({ hasLogin }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const imgs = [
    "img_0.png",
    "img_1.png",
    "img_2.png",
    "img_3.png",
    "img_4.png",
  ];

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      className="relative z-50 w-full h-auto min-h-screen overflow-hidden bg-secondary"
      opts={{
        loop: true,
        align: "center",
        containScroll: false,
      }}
      plugins={[Autoplay({ delay: 5000 }), Fade()]}
    >
      <div className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-between",
        "bg-gradient-to-t from-secondary via-secondary/80 to-secondary/80 from-0% via-20% to-100%"
      )}>
        <div className="text-center flex flex-col items-center font-medium">
          <Image
            src="/img/home/SCTI.png"
            alt="Logo SCT"
            width={250}
            height={250}
            className="w-64 h-auto mt-16"
          />
          <div>
            <p className="mt-4 sm:text-xl text-zinc-50">SEMANA DA CIÊNCIA</p>
            <p className="text-purple-600 sm:text-xl mt-[-8px]">
              E TECNOLOGIA DA INFORMAÇÃO
            </p>
          </div>
        </div>
        <h2 className="sm:max-w-1/2 text-center sm:text-xl font-medium text-zinc-50 px-4">
          Explore o futuro através da ciência e tecnologia. Participe de
          palestras, workshops e demonstrações que moldarão o amanhã.
        </h2>
        <div className="flex justify-center items-center gap-6">
          {hasLogin ? (
            <Button className="w-36" asChild variant="home">
              <Link href="events/scti">Evento</Link>
            </Button>
          ) : (
            <Button className="w-36" asChild variant="home">
              <Link href="login">Entrar</Link>
            </Button>
          )}
          <Button className="w-36" asChild variant="home">
            <Link href="#info">Saiba Mais</Link>
          </Button>
        </div>
        <div className="w-full flex justify-center items-center flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-around">
          <div className="flex items-end justify-center">
            <Calendar className="text-purple-700 mr-1" />
            <p className="text-xs sm:text-sm text-zinc-50">
              01 - 05 de Setembro de 2025
            </p>
          </div>
          <div className="flex items-end justify-center">
            <MapPin className="text-purple-700 mr-1" />
            <p className="text-xs sm:text-sm text-zinc-50 hidden xs:block">
              Universidade Estadual do Norte Fluminense Darcy Ribeiro - UENF
            </p>
            <p className="text-xs sm:text-sm text-zinc-50 block xs:hidden">
              UENF
            </p>
          </div>
        </div>
        <div className="flex items-center z-20 justify-end gap-2 mb-8">
          {Array.from({ length: count }).map((_, index) => (
            <Button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "h-4 w-4 rounded-full border-2 border-primary cursor-pointer hover:bg-zinc-100",
                {
                  "bg-zinc-100": current === index + 1,
                }
              )}
            />
          ))}
        </div>
      </div>
      <CarouselContent
        className={cn(
          "w-full h-full max-h-screen m-0",
          "aspect-[9/19] md:aspect-square"
        )}
      >
        {imgs.map((name) => (
          <CarouselItem key={name} className="relative w-full h-full p-0">
            <Image
              src={`/img/home/${name}`}
              alt="Evento Imagem 3"
              width={2000}
              height={2000}
              className="blur-xs w-full h-full object-cover"
              priority
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default InfoCarousel;
