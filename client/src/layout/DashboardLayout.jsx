import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
