"use client"
import ActivityListSection from "@/components/Activities/ActivityListSection";
import ProductListSection from "@/components/Products/ProductListSection";
import CustomGenericTabs, { type TabItem } from "@/components/ui/Generic/CustomGenericTabs";
import { useUserEvents } from "@/contexts/UserEventsProvider";
import { Activity, Boxes, Plus } from "lucide-react";
import { useState } from "react";

interface EventSlugTabManagerProps {
  isEventCreator: boolean,
  eventId: string,
  userId: string,
  slug: string,
}

export default function EventSlugTabManager({
  isEventCreator,
  eventId,
  userId,
  slug
}: EventSlugTabManagerProps) {
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { myEvents } = useUserEvents();
  const isUserRegistered = (myEvents.find(item => item.ID === eventId) && true) || false;

  const tabs: TabItem[] = [
    {
      id: "activities",
      label: "Atividades",
      content: (
        <ActivityListSection
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
        icon: <Plus className="w-8 h-8"/>,
        fabVariant: {color: "primary"}
      },
    },
    {
      id: "products",
      label: "Produtos",
      content: (
        <ProductListSection 
          currentEvent={{ id: eventId, slug }} 
          isEventCreator={isEventCreator} 
          isCreationModalOpen={isCreationModalOpen}
          setIsCreationModalOpen={setIsCreationModalOpen}
          query={query}
          setQuery={setQuery}
          isUserRegistered={isUserRegistered}
        />
      ),
      icon: <Boxes />,
      fab: {
        icon: <Plus className="w-8 h-8"/>,
        fabVariant: {color: "secondary"},
        onClick: () => setIsCreationModalOpen(true),
      }
    },
  ]
  return (
    <div className="flex flex-col items-center max-h-screen w-full overflow-hidden">
      <CustomGenericTabs tabs={tabs} className="max-w-7xl" showFab={isEventCreator}/>
    </div>
  )
}