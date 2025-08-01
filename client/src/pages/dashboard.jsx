import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/AdminDashboard";
import UserDashboard from "@/components/UserDashboard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {user?.role && user.role ==="admin"?<AdminDashboard/>:<UserDashboard/>}
    </div>
  );
}
