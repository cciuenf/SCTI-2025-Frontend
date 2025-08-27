"use client";
import ActivityListSection from "@/components/Activities/ActivityListSection";
import ProductListSection from "@/components/Products/ProductListSection";
import CustomGenericTabs, {
  type TabItem,
} from "@/components/ui/Generic/CustomGenericTabs";
import { Activity, Boxes, Plus } from "lucide-react";
import { useState } from "react";

interface EventSlugTabManagerProps {
  isEventCreator: boolean;
  isAdminStatus: { isAdmin: boolean; type: "admin" | "master_admin" | "" };
  eventId: string;
  userId: string;
  slug: string;
}

export default function EventSlugTabManager({
  isEventCreator,
  isAdminStatus,
  eventId,
  userId,
  slug,
}: EventSlugTabManagerProps) {
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  const handlePrivilege = () => {
    if (isEventCreator) {
      return true;
    }

    if (isAdminStatus.isAdmin && isAdminStatus.type == "master_admin") {
      return true;
    }

    return false;
  };

  const mustShowFab = handlePrivilege()

  const tabs: TabItem[] = [
    {
      id: "activities",
      label: "Atividades",
      content: (
        <ActivityListSection
          isAdminStatus={isAdminStatus}
          isEventCreator={isEventCreator}
          currentEvent={{ id: eventId, slug }}
          user_id={userId}
          isCreationModalOpen={isCreationModalOpen}
          setIsCreationModalOpen={setIsCreationModalOpen}
        />
      ),
      icon: <Activity />,
      fab: {
        onClick: () => setIsCreationModalOpen(true),
        icon: <Plus className="w-8 h-8" />,
        fabVariant: { color: "primary" },
      },
    },
    {
      id: "products",
      label: "Produtos",
      content: (
        <ProductListSection
          currentEvent={{ id: eventId, slug }}
          isEventCreator={isEventCreator}
          isAdminStatus={isAdminStatus}
          isCreationModalOpen={isCreationModalOpen}
          setIsCreationModalOpen={setIsCreationModalOpen}
        />
      ),
      icon: <Boxes />,
      fab: {
        icon: <Plus className="w-8 h-8" />,
        fabVariant: { color: "secondary" },
        onClick: () => setIsCreationModalOpen(true),
      },
    },
  ];
  return (
    <div className="w-full flex flex-col items-center">
      <CustomGenericTabs
        tabs={tabs}
        className="max-w-7xl"
        showFab={mustShowFab}
      />
    </div>
  );
}
