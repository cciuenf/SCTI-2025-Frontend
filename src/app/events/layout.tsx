import { UserEventsProvider } from "@/contexts/UserEventsProvider";

export default function EventsLayout({
  children, 
}: Readonly<{ children: React.ReactNode;
}>) {
  return (
    <UserEventsProvider>
      {children}
    </UserEventsProvider>
  );
}