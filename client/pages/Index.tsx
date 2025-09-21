import Hero from "@/components/wanderwise/Hero";
import Onboarding from "@/components/wanderwise/Onboarding";
import Itinerary from "@/components/wanderwise/Itinerary";
import Bookings from "@/components/wanderwise/Bookings";
import Profile from "@/components/wanderwise/Profile";
import Extras from "@/components/wanderwise/Extras";
import TravelTimeline from "@/components/wanderwise/TravelTimeline";
import SideAssistant from "@/components/wanderwise/SideAssistant";

export default function Index() {
  return (
    <div className="pb-10">
      <Hero />
      <Onboarding />
      <TravelTimeline />
      <Itinerary />
      <Bookings />
      <Profile />
      <Extras />
      <SideAssistant />
    </div>
  );
}
