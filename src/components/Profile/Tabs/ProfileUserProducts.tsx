import UserProducts from "@/components/UserProducts";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

export function ProfileUserProducts() {
  return (
    <section
      className={cn(
        'mx-auto w-full h-screen max-w-7xl pt-6 gap-4',
        'flex flex-col overflow-y-auto scrollbar-unvisible'
      )}
    >
      <header className="flex items-center justify-center gap-3">
        <Package className="h-15 w-15 p-2 bg-zinc-100 rounded-2xl text-zinc-700" />
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Meus Produtos</h2>
          <p className="text-sm text-zinc-600">Visualize todos os seus produtos adquiridos</p>
        </div>
      </header>

      <UserProducts />
    </section>
  );
}