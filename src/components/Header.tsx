import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="w-full h-10 px-3 flex justify-around items-center">
      <Button asChild variant={"link"}>
        <Link href={"/"}>Home</Link>
      </Button>
      <Button asChild variant={"link"}>
        <Link href={"/dashboard"}>Dashboard</Link>
      </Button>
      <Button asChild variant={"link"}>
        <Link href={"/events"}>Events</Link>
      </Button>
      <Button asChild variant={"link"}>
        <Link href={"/products"}>Products</Link>
      </Button>
      <Button asChild variant={"link"}>
        <Link href={"/Activites"}>Activites</Link>
      </Button>
    </div>
  );
};

export default Header;
