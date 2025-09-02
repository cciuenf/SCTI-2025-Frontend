"use client";
import ActivityListSection from "@/components/Activities/ActivityListSection";
import ProductListSection from "@/components/Products/ProductListSection";
import CustomGenericTabs, {
  type TabItem,
} from "@/components/ui/Generic/CustomGenericTabs";
import { useUserEvents } from "@/contexts/UserEventsProvider";
import { Activity, Boxes, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams()
  const currentView = searchParams.get("view") || "activities"
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { myEvents } = useUserEvents();
  const isUserRegistered = (myEvents.find(item => item.ID === eventId) && true) || false;

  const handlePrivilege = () => {
    if (isEventCreator) return true;
    
    if (isAdminStatus.isAdmin && isAdminStatus.type == "master_admin") return true;

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
          query={query}
          setQuery={setQuery}
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
          query={query}
          setQuery={setQuery}
          isUserRegistered={isUserRegistered}
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
    <div className="flex flex-col items-center max-h-screen w-full overflow-hidden">
      <CustomGenericTabs
        tabs={tabs}
        initialTabId={currentView} 
        className="max-w-7xl"
        showFab={mustShowFab}
      />
    </div>
  );
}
