"use client";
import {
  handleGetActivitiesWhichUserParticipate,
  handleGetUserEventActivities,
} from "@/actions/activity-actions";
import {
  handleGetAllUserProducts,
  handleGetAllUserProductsPurchases,
} from "@/actions/product-actions";
import {
  convertNumberToBRL,
  getUserParticipationPercentage,
} from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Activity,
  CheckCircle,
  LucideCircleDollarSign,
} from "lucide-react";

type Props = {
  type?: "subs" | "user" | "spent";
  data?: { label: string; content: string | undefined };
};

const DashboardTopLayer = ({ type, data }: Props) => {
  const [totalSpent, setTotalSpent] = useState<number>(0.0);
  const [totalEvents, setTotalEvents] = useState<string>("0");
  const [totalAttendedEvents, setTotalAttendedEvents] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserTotalSpent = async () => {
      setIsLoading(true);
      const [products, purchases] = await Promise.all([
        handleGetAllUserProducts(),
        handleGetAllUserProductsPurchases(),
      ]);
      const initialValue: number = 0.0;

      if (products.success && purchases.success) {
        const productsMap = new Map(
          (products.data || []).map((p) => [p.ID, p])
        );

        const purchasesWithProducts = (purchases.data || []).map((p) => ({
          ...p,
          product: productsMap.get(p.product_id),
        }));

        const total: number = purchasesWithProducts.reduce((acc, p) => {
          if (p.product) {
            acc = acc + p.product?.price_int;
          }

          return acc;
        }, initialValue);

        setTotalSpent(total);
        setIsLoading(false);
      }
    };

    const getUserTotalEvents = async () => {
      setIsLoading(true);

      const events = await handleGetUserEventActivities("scti");

      if (events && events.data) {
        events.data.forEach((e) => {});
      }

      if (events.data) {
        setTotalEvents(events.data.length.toString());
      }
      setIsLoading(false);
    };

    const getUserParticipations = async () => {
      setIsLoading(true);
      const activitiesWhichUserParticipate =
        await handleGetActivitiesWhichUserParticipate();
      if (
        activitiesWhichUserParticipate.success &&
        activitiesWhichUserParticipate.data
      ) {
        setTotalAttendedEvents(
          activitiesWhichUserParticipate.data.length.toString()
        );
      }
      setIsLoading(false);
    };

    getUserTotalEvents();
    getUserTotalSpent();
    getUserParticipations();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-2">
      <div className="flex justify-between items-center bg-blue-500 px-5 py-2 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col justify-around items-start">
          <h3 className="text-2xl text-blue-200">Atividades Inscrito</h3>
          <h2 className="text-4xl text-zinc-50 font-bold">{totalEvents}</h2>
        </div>
        <Activity className="w-12 h-12 text-blue-200" />
      </div>
      <div className="flex justify-between items-center bg-yellow-500 px-5 py-2 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col justify-around items-start">
          <h3 className="text-2xl text-yellow-200">Total Gasto</h3>
          <h2 className="text-4xl text-zinc-50 font-bold">
            {convertNumberToBRL(totalSpent)}
          </h2>
        </div>
        <LucideCircleDollarSign className="w-12 h-12 text-yellow-200" />
      </div>
      <div className="flex justify-between items-center bg-green-500 px-5 py-2 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex flex-col justify-around items-start">
          <h3 className="text-2xl text-green-200">Atividades Concluídas</h3>
          <h2 className="text-4xl text-zinc-50 font-bold">{ totalAttendedEvents}</h2>

          <p className="text-xs text-green-200">
            {getUserParticipationPercentage(totalEvents, totalAttendedEvents)}{" "}
            de participação
          </p>
        </div>
        <CheckCircle className="w-12 h-12 text-green-200" />
      </div>
    </div>
  );
};

export default DashboardTopLayer;
