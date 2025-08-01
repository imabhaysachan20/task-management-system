import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      </div>
    </>
  );
}
