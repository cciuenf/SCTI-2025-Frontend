import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

const UserPurchasesSkeleton = () => {
  return (
    <div className="w-full mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data de Compra</TableHead>
            <TableHead>Presenteou</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
            <TableCell>
              <Skeleton className="w-4/5 h-3 mx-auto"></Skeleton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="w-full flex flex-col sm:flex-row justify-around items-center mt-5 gap-3">
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="w-8 h-5"></Skeleton>
          <h3 className="text-zinc-900/70 text-sm sm:text-base">
            Compras finalizadas
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="w-8 h-5"></Skeleton>
          <h3 className="text-zinc-900/70 text-sm sm:text-base">Total gasto</h3>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Skeleton className="w-8 h-5"></Skeleton>
          <h3 className="text-zinc-900/70 text-sm sm:text-base">
            Compras pendentes
          </h3>
        </div>
      </div>
    </div>
  );
};

export default UserPurchasesSkeleton;
